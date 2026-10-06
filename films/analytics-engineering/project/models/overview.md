{% docs __overview__ %}
# The credential model, built

The example project behind *In the weeds of data crafting*. It builds the slice of the
university's credential model (v3) that answers Planning's question: how many learners are
within 15 credit points of a graduate certificate, by faculty, as at census date? The learner's
wallet app reads the same facts, as they are now.

- **Staging**: one model per source table. Rename, cast, add keys qualified by their key set, and their hashes.
- **Intermediate**: match a learner's keys across systems, stitch one timeline per learner, apply the credit rule.
- **Core**: one model per entity and relationship, public, with an enforced contract: the enterprise contract.
- **Marts**: one per consumer, protected, with an enforced contract: the consumer contract.

The models are organised by domain, following the reference model, TCSI: the core's `student`
and `course` domains, and the marts' `planning` and `wallet`. Each domain's folder holds its
meaning (the conceptual model and the definitions generated from it), its column descriptions
and its physical diagram. The process, decisions and gaps are in `docs/`. The university and
everyone in it are fictional.
{% enddocs %}
