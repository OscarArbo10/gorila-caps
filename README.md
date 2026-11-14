# 🦍 Gorila Caps

Tienda web de gorras en blanco y negro con estilo "gorila": catálogo dinámico, carrito, compras por **WhatsApp**, **panel admin** y base de datos **Supabase**, lista para desplegar en **Vercel**.

## Funcionalidades

- **Tienda**: hero animado (los ojos del gorila siguen el cursor), marquee, catálogo con filtros por categoría, buscador y orden por precio, tarjetas con efecto 3D, página de detalle por producto.
- **Carrito** guardado en el navegador y **checkout por WhatsApp**: genera el mensaje con productos, cantidades, total, nombre, ciudad y nota.
- **Botón "Comprar ya"** en cada producto y botón flotante de WhatsApp.
- **Panel admin** (`/admin`): login con Supabase Auth, estadísticas, crear / editar / eliminar gorras, subir imágenes a Supabase Storage, activar/ocultar y marcar destacados.
- **Seguridad**: Row Level Security; solo los usuarios de la tabla `admins` pueden modificar el catálogo.
- Si Supabase no está configurado, la tienda muestra productos de demostración.

## 1. Configurar Supabase

1. Crea un proyecto en https://supabase.com.
2. Ve a **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo.
   (Crea la tabla `products`, la tabla `admins`, las políticas RLS, el bucket `products` y 6 productos de ejemplo).
3. Ve a **Authentication → Users → Add user**, crea tu usuario admin (email + contraseña, marca *Auto Confirm User*).
4. Copia el UUID del usuario y ejecuta en el SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('TU-UUID');
   ```
5. (Recomendado) En **Authentication → Providers → Email** desactiva *Allow new users to sign up*.
6. Copia de **Project Settings → API**: `Project URL` y `anon public key`.

## 2. Correr localmente

```bash
cp .env.example .env.local   # y completa los valores
npm install
npm run dev
```

Abre http://localhost:3000 (tienda) y http://localhost:3000/admin (panel).

## 3. Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En https://vercel.com → **Add New → Project** → importa el repositorio (framework: Next.js, detectado automáticamente).
3. En **Environment Variables** agrega:
   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | ej. `573001234567` (código país + número) |
4. **Deploy**. 

Alternativa por CLI:
```bash
npm i -g vercel
vercel           # vincula el proyecto
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
vercel --prod
```

## Estructura

```
app/
  page.js                 Home (hero, catálogo, manada)
  producto/[id]/page.js   Detalle de producto
  admin/page.js           Panel admin
  api/revalidate/route.js Refresca la tienda tras cambios del admin
components/               UI (GorillaFace, CapArt, Cart, Catalog, ...)
components/admin/         Login, Dashboard, formulario de producto
lib/                      Cliente Supabase y utilidades
supabase/schema.sql       Esquema de la base de datos
```

## Personalización rápida

- **Moneda / formato**: `formatPrice` en `lib/products.js` (por defecto COP).
- **Categorías sugeridas**: `CATEGORIES` en `lib/products.js`.
- **Colores y animaciones**: `app/globals.css`.
