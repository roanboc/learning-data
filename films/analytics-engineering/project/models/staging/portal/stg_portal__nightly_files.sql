-- The receipts of the portal's nightly feed: each file it sent, when it arrived, and when the
-- portal saved the newest record in it. The graduation list says its age from that last date, the
-- records' own (portal_as_of).

with

source as (

    select * from {{ source('portal', 'nightly_files') }}

)

select
    trim(file_name) as file_name,
    cast(received_at as timestamp) as received_at,
    cast(newest_record_at as timestamp) as newest_record_at
from source
