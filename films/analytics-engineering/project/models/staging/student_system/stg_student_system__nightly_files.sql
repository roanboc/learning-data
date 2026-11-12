-- The receipts of the night's transfer: each nightly file the student system sent, when it arrived,
-- and when the student system saved the newest record in it. The graduation list says its age from
-- that last date, the records' own (student_system_as_of).

with

source as (

    select * from {{ source('student_system', 'nightly_files') }}

)

select
    trim(file_name) as file_name,
    cast(received_at as timestamp) as received_at,
    cast(newest_record_at as timestamp) as newest_record_at
from source
