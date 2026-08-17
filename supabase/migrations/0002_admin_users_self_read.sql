-- Permite que un usuario autenticado lea ÚNICAMENTE su propia fila en
-- admin_users (auth.uid() = id) — necesario para que el layout de /admin
-- pueda verificar "¿esta sesión pertenece a alguien del equipo?" usando el
-- cliente con sesión (anon key + cookie), sin necesitar service_role para
-- ese chequeo. No expone las filas de otros admins.
create policy "self read admin_users" on admin_users
  for select using (auth.uid() = id);
