# Hot: each change to a staff member's bank account, checked against the sign-in behind it within a
# second, and one pay held when the change looks wrong. Structured Streaming in real-time mode, on
# Databricks classic compute. Databricks only; CI doesn't run it.
#
# In August 2026 someone stole two staff members' passwords and changed their bank accounts the night
# before pay day; their pay went to a stranger's account, and they waited three weeks to be paid again.
# No report read the next morning could have stopped it: by then the money had gone. No person is
# waiting to decide here, and the action must come at once, so this is one of the very few needs kept
# hot. It costs the most, because it never stops.
#
# Two event streams, each on an Event Hubs namespace read through its Kafka endpoint (real-time mode
# reads Kafka-compatible sources, not Delta tables):
#   bank-account-changes  payroll sends one event per change: staff_id, session_id, changed_at
#   sign-ins              the identity provider sends one event per sign-in: session_id, staff_id,
#                         device_id, new_device (true the first time a device is seen), signed_in_at
# The rule: a change made in a session from a new device within three days of pay day holds that one
# pay and asks the person to confirm. Since September 2026 it held four changes: three were the people
# themselves, confirmed within the hour; one was not.
#
# An event carries only what changed. The full pay record, and every correction, still come in payroll's
# nightly file (pay_records, the cold path), so this never stands alone.
#
# Owner: HR (Ingrid Holm). See service_levels.yaml, bank_account_changes: latency 1 s.
# Cluster: Databricks Runtime 18 LTS or above (a stream-to-stream join in real-time mode), autoscaling,
# Photon and spot instances off, and spark.databricks.streaming.realTimeMode.enabled set to true. The
# join's own settings are in the docs' "Stream to stream joins" for real-time mode.

from pyspark.sql import functions as F

from payroll_client import days_to_pay_day, hold_next_pay  # a placeholder for payroll's own interface

EVENT_HUBS = "<namespace>.servicebus.windows.net:9093"
KAFKA = {  # Event Hubs' Kafka endpoint; the connection string comes from a secret scope, never the code
    "kafka.bootstrap.servers": EVENT_HUBS,
    "kafka.security.protocol": "SASL_SSL",
    "kafka.sasl.mechanism": "PLAIN",
    "kafka.sasl.jaas.config": (
        'kafkashaded.org.apache.kafka.common.security.plain.PlainLoginModule required '
        f'username="$ConnectionString" password="{dbutils.secrets.get("payroll", "event-hubs")}";'
    ),
}


def events(topic, schema):
    return (spark.readStream.format("kafka").options(**KAFKA).option("subscribe", topic).load()
            .select(F.from_json(F.col("value").cast("string"), schema).alias("e")).select("e.*"))


changes = events("bank-account-changes", "staff_id string, session_id string, changed_at timestamp")
sign_ins = events("sign-ins", "session_id string, staff_id string, device_id string, new_device boolean, signed_in_at timestamp")

# Each change, with the sign-in behind it: an inner join on the session, the sign-in no more than a
# day before the change
checked = (changes.withWatermark("changed_at", "1 day").alias("c")
           .join(sign_ins.withWatermark("signed_in_at", "1 day").alias("s"),
                 F.expr("c.session_id = s.session_id and s.signed_in_at between c.changed_at - interval 1 day and c.changed_at"))
           .select("c.staff_id", "c.changed_at", "s.device_id", "s.new_device"))


class HoldPay:
    """Payroll's own interface holds one person's next pay and sends them a message to confirm the change.
    Called for each change the rule flags; a ForeachWriter, the sink real-time mode supports for this."""

    def open(self, partition_id, epoch_id):
        return True

    def process(self, row):
        if row.new_device and days_to_pay_day(row.changed_at) <= 3:
            hold_next_pay(row.staff_id, reason="bank account changed from a new device")

    def close(self, error):
        pass


(checked.writeStream
 .foreach(HoldPay())
 .option("checkpointLocation", "/Volumes/<production catalog>/<payroll schema>/checkpoints/bank_change_hold")
 .outputMode("update")
 .trigger(realTime="5 minutes")  # real-time mode: each event handled as it arrives; 5 minutes is the checkpoint interval
 .start())
