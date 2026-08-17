-- Guarda la clave del catálogo estándar (packages/database/src/exam-catalog.ts)
-- cuando el analito viene del catálogo, en vez de solo el nombre en texto.
-- Permite hacer lógica confiable sobre analitos específicos (ej. estadificación
-- IRIS a partir de creatinina/SDMA) sin depender de coincidencia de texto libre.
-- NULL cuando el analito se cargó como "otro" (no está en el catálogo).

alter table lab_results add column analyte_key text;
