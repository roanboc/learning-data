-- The receipts of the night's transfer: each nightly file the student system sent, and when it
-- arrived. The graduation list says its age from them (student_system_as_of).

with

source as (

    select * from {{ source('student_system', 'nightly_files') }}

)

select
    trim(file_name) as file_name,
    cast(received_at as timestamp) as received_at
from source
