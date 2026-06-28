# Dev Tracker — Guía de instalación con Supabase (tiempo real)

## Resumen
- **Supabase** = base de datos gratuita en la nube (todos ven lo mismo)
- **Vercel** = hosting gratuito (link para compartir)
- **GitHub** = guarda el código

---

## PASO 1 — Configura Supabase (5 minutos)

### 1.1 Crea el proyecto
1. Entra a [supabase.com](https://supabase.com) → **"New project"**
2. Ponle nombre (ej: `dev-tracker`), elige una contraseña y región → **"Create new project"**
3. Espera ~1 minuto a que termine de crear

### 1.2 Crea las tablas (copia y pega en el SQL Editor)
1. En el menú izquierdo ve a **"SQL Editor"**
2. Copia y pega este SQL completo y presiona **"Run"**:

```sql
-- Tabla de proyectos
create table projects (
  id bigint generated always as identity primary key,
  name text not null,
  color text not null default '#6366F1',
  stages jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Tabla de configuración (una sola fila)
create table config (
  id int primary key default 1,
  data jsonb not null default '{}'
);

-- Insertar configuración inicial
insert into config (id, data) values (1, '{
  "yellowDays": 3,
  "redDays": 7,
  "users": [{"id": 1, "name": "Admin", "role": "editor"}]
}');

-- Habilitar tiempo real
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table config;

-- Permitir acceso público (ajustar con RLS si necesitas seguridad)
alter table projects enable row level security;
alter table config enable row level security;

create policy "Allow all" on projects for all using (true) with check (true);
create policy "Allow all" on config for all using (true) with check (true);
```

### 1.3 Copia tus credenciales
1. Ve a **Settings → API** (en el menú izquierdo)
2. Copia:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una clave larga

Guárdalas, las necesitas en el Paso 3.

---

## PASO 2 — Sube el código a GitHub (2 minutos)

1. Ve a [github.com](https://github.com) → **"New repository"**
2. Nombre: `dev-tracker` → **"Create repository"**
3. Clic en **"uploading an existing file"**
4. Arrastra todos los archivos de esta carpeta (descomprimida) → **"Commit changes"**

---

## PASO 3 — Despliega en Vercel con las credenciales (3 minutos)

1. Ve a [vercel.com](https://vercel.com) → **"Log in with GitHub"**
2. **"Add New Project"** → importa `dev-tracker` → **NO hagas clic en Deploy todavía**
3. Abre la sección **"Environment Variables"** y agrega estas dos:

| Nombre | Valor |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tuproyecto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `tu_clave_anon_larga` |

4. Ahora sí: **"Deploy"** → espera ~1 minuto
5. ✅ Vercel te da un link: `https://dev-tracker-xxxxx.vercel.app`

**Ese link lo pueden abrir todos al mismo tiempo y verán los mismos datos en tiempo real.**

---

## Cómo funciona el tiempo real

- Cuando alguien edita una etapa, **todos los que tienen el link abierto ven el cambio al instante** (sin recargar la página)
- Los datos viven en Supabase, no en el navegador de nadie
- Supabase gratuito aguanta hasta 500MB de datos y conexiones simultáneas ilimitadas

---

## Estructura del proyecto

```
dev-tracker/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   └── page.js
│   └── components/
│       └── Dashboard.js   ← todo el dashboard
├── .env.local.example     ← referencia de variables (no subir al real)
├── package.json
├── next.config.js
└── README.md
```

---

## ¿Problemas?

- **Pantalla de error "No se pudo conectar"** → revisa que las variables de entorno en Vercel estén correctas (sin espacios extra)
- **Los cambios no se ven en tiempo real** → asegúrate de haber corrido el SQL de `alter publication supabase_realtime`
- **Cualquier otra duda** → comparte este README con Claude y describe el problema

