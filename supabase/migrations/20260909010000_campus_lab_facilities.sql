-- Replace campus facility cards with verified GPW Srinagar laboratories
-- and technical facilities. Removes unverified Electrical Machines Lab
-- and Civil Survey Lab name-only entries.

delete from public.campus_facility_items;

insert into public.campus_facility_items (name, description, sort_order, is_active)
values
  ('Computer & IT Laboratories', 'Practical computing, programming, software and digital learning facilities.', 1, true),
  ('Electronics & Communication Laboratory', 'Hands-on training in electronics, circuits, communication and measurement.', 2, true),
  ('Food Technology Laboratory', 'Practical training related to food processing, testing and quality control.', 3, true),
  ('Medical Laboratory Technology Lab', 'Practical learning in clinical laboratory techniques and diagnostics.', 4, true),
  ('Garment Technology Laboratory', 'Practical training in garment construction, production and related techniques.', 5, true),
  ('Textile Technology Laboratory', 'Practical textile processing, materials and production training.', 6, true),
  ('Engineering Workshop', 'Hands-on technical and workshop-based practical training.', 7, true),
  ('Library & Learning Resources', 'Academic reference, study and learning resources.', 8, true),
  ('Smart Classrooms & IT Infrastructure', 'Technology-supported teaching and digital learning.', 9, true),
  ('Auditorium & Seminar Facilities', 'Academic events, seminars and institutional programmes.', 10, true);
