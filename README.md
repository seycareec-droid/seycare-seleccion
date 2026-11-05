# Seycare Nails — Proceso de Selección

## Variables de entorno (agregar en Render)

```
REACT_APP_SUPABASE_URL=https://bmruuriwpqyzkfasqywl.supabase.co
REACT_APP_SUPABASE_ANON=<llave publishable: sb_publishable_...>
```

**Nunca** pongas la service role key ni una llave `sb_secret_...` aquí. Todo lo que
empieza con `REACT_APP_` se incluye en el JavaScript público del sitio.

## Deploy en Render

- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Static Site

## Acceso admin

Tocar el logo 5 veces en la pantalla de inicio → iniciar sesión con correo y contraseña
(Supabase Auth). Solo entran los correos registrados en la tabla `seleccion_admins`.

## Seguridad (base de datos)

- Las candidatas se registran con la función `registrar_candidata` (la llave pública no
  puede leer, editar ni borrar la tabla `candidatas`).
- Solo las administradoras con sesión leen y editan (`es_admin_seleccion()`).
- Archivos adjuntos: desactivados por ahora. El formulario solo recibe un enlace de portafolio.
