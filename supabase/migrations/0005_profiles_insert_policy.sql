-- Permite que un usuario cree su propia fila en profiles (auth.uid() = id).
-- Hacía falta como respaldo del trigger handle_new_user (migración 0003):
-- ese trigger solo corre para usuarios NUEVOS de auth.users. Los usuarios
-- creados antes de que existiera el trigger (ej. el primer admin) se
-- quedaron sin fila en profiles, lo que rompía cualquier insert en `pets`
-- (customer_id referencia profiles.id). Con esta policy, el código puede
-- crear la fila de forma defensiva la primera vez que haga falta, sin
-- necesitar service_role.
create policy "insert own profile" on profiles
  for insert
  with check (auth.uid() = id);
