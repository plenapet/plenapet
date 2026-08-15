-- Datos semilla de desarrollo — mismo catálogo representativo que
-- packages/database/src/mock/seed.ts, para que Supabase arranque con datos
-- consistentes con lo que ya se probó en local. No es el catálogo real de
-- VetShipping (ver Arquitectura/Integracion-VetShipping.md).

insert into categories (slug, name) values
  ('alimentos', 'Alimentos'),
  ('farmacia-veterinaria', 'Farmacia veterinaria'),
  ('desparasitantes', 'Desparasitantes'),
  ('vitaminas-suplementos', 'Vitaminas y suplementos'),
  ('higiene', 'Higiene'),
  ('accesorios', 'Accesorios'),
  ('bienestar', 'Bienestar');

insert into brands (slug, name) values
  ('royal-canin', 'Royal Canin'),
  ('hills', 'Hill''s'),
  ('pro-plan', 'Pro Plan'),
  ('msd-salud-animal', 'MSD Salud Animal'),
  ('boehringer', 'Boehringer Ingelheim'),
  ('virbac', 'Virbac'),
  ('vetruus', 'Vetruus'),
  ('plenapet-basics', 'PlenaPet Basics');

insert into products
  (slug, name, short_description, description, brand_id, category_id, species, life_stage, presentation, price_cents, compare_at_price_cents, stock_status, requires_prescription, active)
values
  ('royal-canin-adult-mediano-15kg', 'Royal Canin Adult Mediano 15kg', 'Alimento seco para perro adulto de raza mediana.', 'Fórmula balanceada para perros adultos de raza mediana (11 a 25 kg), con nutrientes para apoyar la digestión y la salud de piel y pelo.', (select id from brands where slug = 'royal-canin'), (select id from categories where slug = 'alimentos'), '{perro}', 'adulto', 'Bulto 15 kg', 28500000, 31000000, 'in_stock', false, true),
  ('hills-science-diet-puppy-7-5kg', 'Hill''s Science Diet Puppy 7.5kg', 'Alimento seco para cachorro, todas las razas.', 'Nutrición precisa con DHA para el desarrollo cerebral y visual de cachorros durante su primer año.', (select id from brands where slug = 'hills'), (select id from categories where slug = 'alimentos'), '{perro}', 'cachorro', 'Bulto 7.5 kg', 21000000, null, 'in_stock', false, true),
  ('pro-plan-cat-adult-salmon-7-5kg', 'Pro Plan Cat Adult Salmón 7.5kg', 'Alimento seco para gato adulto, salmón.', 'Con OPTIRENAL para apoyar la salud renal desde etapas tempranas y salmón como primer ingrediente.', (select id from brands where slug = 'pro-plan'), (select id from categories where slug = 'alimentos'), '{gato}', 'adulto', 'Bulto 7.5 kg', 19500000, null, 'in_stock', false, true),
  ('royal-canin-kitten-3kg', 'Royal Canin Kitten 3kg', 'Alimento seco para gatito hasta los 12 meses.', 'Apoya las defensas naturales y la digestión de gatitos en crecimiento, croqueta de tamaño adaptado.', (select id from brands where slug = 'royal-canin'), (select id from categories where slug = 'alimentos'), '{gato}', 'cachorro', 'Bulto 3 kg', 9500000, null, 'in_stock', false, true),
  ('hills-prescription-diet-kd-renal-perro-3-5kg', 'Hill''s Prescription Diet k/d Renal Perro 3.5kg', 'Alimento terapéutico para soporte renal.', 'Formulado para el manejo nutricional de enfermedad renal crónica. Uso bajo indicación de un médico veterinario.', (select id from brands where slug = 'hills'), (select id from categories where slug = 'farmacia-veterinaria'), '{perro}', 'todas', 'Bulto 3.5 kg', 18000000, null, 'in_stock', true, true),
  ('royal-canin-veterinary-urinary-gato-3-5kg', 'Royal Canin Veterinary Urinary Gato 3.5kg', 'Alimento terapéutico para soporte urinario.', 'Ayuda a disolver los cálculos de estruvita y reduce el riesgo de recurrencia. Uso bajo indicación de un médico veterinario.', (select id from brands where slug = 'royal-canin'), (select id from categories where slug = 'farmacia-veterinaria'), '{gato}', 'todas', 'Bulto 3.5 kg', 17500000, null, 'low_stock', true, true),
  ('bravecto-perro-10-20kg', 'Bravecto Antipulgas y Garrapatas Perro 10-20kg', 'Comprimido masticable, protección de 12 semanas.', 'Control de pulgas y garrapatas de acción prolongada en una sola toma.', (select id from brands where slug = 'msd-salud-animal'), (select id from categories where slug = 'desparasitantes'), '{perro}', 'todas', '1 comprimido', 9500000, null, 'low_stock', false, true),
  ('drontal-plus-perro-caja-x2', 'Drontal Plus Desparasitante Perro (caja x2)', 'Desparasitante interno de amplio espectro.', 'Elimina nematodos y cestodos comunes en perros. Uso según indicación de dosis por peso.', (select id from brands where slug = 'boehringer'), (select id from categories where slug = 'desparasitantes'), '{perro}', 'todas', 'Caja x2 tabletas', 3200000, null, 'in_stock', false, true),
  ('milbemax-gato', 'Milbemax Desparasitante Gato', 'Desparasitante interno para gatos.', 'Control de nematodos y cestodos intestinales en gatos.', (select id from brands where slug = 'boehringer'), (select id from categories where slug = 'desparasitantes'), '{gato}', 'todas', 'Caja x2 tabletas', 2800000, null, 'in_stock', false, true),
  ('nexgard-gato', 'NexGard Antipulgas Gato', 'Protección mensual contra pulgas.', 'Aplicación tópica de acción rápida y protección mensual.', (select id from brands where slug = 'boehringer'), (select id from categories where slug = 'desparasitantes'), '{gato}', 'todas', '1 pipeta', 5200000, null, 'in_stock', false, true),
  ('vetruus-multivitaminico-perro', 'Vetruus Multivitamínico Perro', 'Complemento vitamínico diario.', 'Aporta vitaminas y minerales esenciales para el bienestar general del perro.', (select id from brands where slug = 'vetruus'), (select id from categories where slug = 'vitaminas-suplementos'), '{perro}', 'todas', 'Frasco x60 tabletas', 4500000, null, 'in_stock', false, true),
  ('condroprotector-articular-gato', 'Condroprotector Articular Gato', 'Apoyo para la salud articular felina.', 'Glucosamina y condroitina para el cuidado de articulaciones en gatos adultos y senior.', (select id from brands where slug = 'vetruus'), (select id from categories where slug = 'vitaminas-suplementos'), '{gato}', 'adulto', 'Frasco x30 tabletas', 5800000, null, 'in_stock', false, true),
  ('omega-3-piel-pelo-perro', 'Omega 3 Piel y Pelo Perro', 'Suplemento para piel y pelaje saludable.', 'Ácidos grasos esenciales que ayudan a mantener un pelaje brillante y piel saludable.', (select id from brands where slug = 'vetruus'), (select id from categories where slug = 'vitaminas-suplementos'), '{perro}', 'todas', 'Frasco 250 ml', 3900000, null, 'in_stock', false, true),
  ('probiotico-digestivo-gato', 'Probiótico Digestivo Gato', 'Apoyo a la flora intestinal.', 'Complemento probiótico para favorecer la digestión y la absorción de nutrientes.', (select id from brands where slug = 'vetruus'), (select id from categories where slug = 'vitaminas-suplementos'), '{gato}', 'todas', 'Caja x30 sobres', 4200000, null, 'in_stock', false, true),
  ('shampoo-antipulgas-perro-500ml', 'Shampoo Antipulgas Perro 500ml', 'Limpieza y control de pulgas.', 'Fórmula suave que limpia y ayuda a controlar pulgas en el pelaje del perro.', (select id from brands where slug = 'virbac'), (select id from categories where slug = 'higiene'), '{perro}', 'todas', 'Frasco 500 ml', 2800000, null, 'in_stock', false, true),
  ('shampoo-hipoalergenico-gato-250ml', 'Shampoo Hipoalergénico Gato 250ml', 'Fórmula suave para piel sensible.', 'Limpieza suave, sin fragancia, para gatos con piel sensible.', (select id from brands where slug = 'virbac'), (select id from categories where slug = 'higiene'), '{gato}', 'todas', 'Frasco 250 ml', 3200000, 3800000, 'in_stock', false, true),
  ('toallitas-humedas-multiuso', 'Toallitas Húmedas Multiuso', 'Limpieza rápida para perros y gatos.', 'Toallitas suaves para limpieza de patas, orejas y pelaje.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'higiene'), '{perro,gato}', 'todas', 'Paquete x80 unidades', 1800000, null, 'in_stock', false, true),
  ('arena-sanitaria-aglomerante-10kg', 'Arena Sanitaria Aglomerante Gato 10kg', 'Control de olores, aglomerado rápido.', 'Arena aglomerante de bajo polvo con control de olores.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'higiene'), '{gato}', 'todas', 'Bolsa 10 kg', 4500000, null, 'in_stock', false, true),
  ('cama-ortopedica-perro-m', 'Cama Ortopédica Perro Talla M', 'Espuma viscoelástica, funda lavable.', 'Soporte articular para perros adultos y senior, funda desmontable y lavable.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'accesorios'), '{perro}', 'todas', 'Talla M (70x50 cm)', 12000000, null, 'in_stock', false, true),
  ('rascador-torre-gato', 'Rascador Torre Gato', 'Torre rascadora con plataformas.', 'Estructura de sisal natural con plataformas de descanso.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'accesorios'), '{gato}', 'todas', '90 cm de alto', 13500000, null, 'out_of_stock', false, true),
  ('correa-retractil-perro', 'Correa Retráctil Perro', 'Extensión hasta 5 metros.', 'Correa retráctil con freno de seguridad, hasta 5 metros.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'accesorios'), '{perro}', 'todas', 'Hasta 25 kg', 6500000, null, 'in_stock', false, true),
  ('transportadora-gato', 'Transportadora Gato', 'Ventilada, apertura superior y frontal.', 'Transportadora rígida y ventilada, ideal para viajes cortos.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'accesorios'), '{gato}', 'todas', 'Hasta 8 kg', 15000000, null, 'in_stock', false, true),
  ('snacks-dentales-perro', 'Snacks Dentales Perro', 'Cuidado dental diario.', 'Ayuda a reducir la placa y el sarro como parte de la rutina diaria.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'bienestar'), '{perro}', 'todas', 'Paquete x28 unidades', 2500000, null, 'in_stock', false, true),
  ('pasto-para-gatos', 'Pasto para Gatos (Cat Grass)', 'Apoyo digestivo natural.', 'Kit de cultivo de pasto natural para apoyar la digestión felina.', (select id from brands where slug = 'plenapet-basics'), (select id from categories where slug = 'bienestar'), '{gato}', 'todas', 'Kit de cultivo', 1500000, null, 'in_stock', false, true);
