-- The receipts of the portal's nightly feed: each file it sent, and when it arrived. The
-- graduation list says its age from them (portal_as_of).

with

source as (

    select * from {{ source('portal', 'nightly_files') }}

)

select
    trim(file_name) as file_name,
    cast(received_at as timestamp) as received_at
from source
