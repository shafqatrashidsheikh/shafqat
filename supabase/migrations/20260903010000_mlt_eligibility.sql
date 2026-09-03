-- Medical Laboratory Technology requires Class 12, not Class 10.
update public.departments
set eligibility = '12th Pass'
where slug = 'medical-lab-technology';

update public.programs
set eligibility = '12th Pass'
where name ilike '%medical lab%'
   or department_id in (
     select id from public.departments where slug = 'medical-lab-technology'
   );
