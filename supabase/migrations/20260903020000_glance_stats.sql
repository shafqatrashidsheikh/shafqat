-- At a Glance: verified GPW Srinagar figures only (not KGP or other polytechnics).
delete from public.institute_stats;

insert into public.institute_stats (value, label, prefix, suffix, sort_order) values
  (1986, 'Established', '', '', 1),
  (8, 'Diploma Programmes', '', '', 2),
  (240, 'Sanctioned Seats', '', '', 3),
  (3, 'Diploma Duration', '', ' Years', 4);
