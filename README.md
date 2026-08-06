# MobiHouse

Plataforma web inmobiliaria desarrollada con React y TypeScript. Permite explorar propiedades, ver detalles, gestionar favoritos, consultar un mapa interactivo y conversar con un asistente de inteligencia artificial impulsado por Grok.

Las propiedades se guardan en **Firebase Firestore** (plan gratuito), para que el panel administrativo pueda agregar, editar y eliminar en tiempo real, y la sección Propiedades las muestre al instante.

## Características

- **Inicio** con hero, buscador y sección de contacto
- **Catálogo de propiedades** con filtros, sincronizado con Firebase
- **Detalle de propiedad** con galería, mapa, amenities y contacto con agente
- **Mapa interactivo** con ubicación de propiedades (Leaflet + OpenStreetMap)
- **Favoritos** persistentes en el navegador
- **Mensajes** entre usuario y contactos
- **Asistente IA** con Grok (xAI) para consultas sobre propiedades
- **Panel administrativo** con CRUD real de propiedades (Firebase)
- **Autenticación** con roles de usuario y administrador

## Tecnologías

| Área | Stack |
|------|--------|
| Frontend | React 19, TypeScript, Vite |
| Estilos | Tailwind CSS 4 |
| Routing | React Router 7 |
| Autenticación | Firebase Authentication |
| Base de datos | Firebase Firestore + reglas |
| Storage | Firebase Storage + reglas |
| Mapas | Leaflet, React Leaflet |
| IA | Grok API (xAI) con token y rate limit |
| Iconos | React Icons |

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Proyecto Firebase (plan Spark / gratuito)
- API key de xAI (opcional, para el asistente IA)

## Configurar Firebase (paso a paso)

1. Entrá a [Firebase Console](https://console.firebase.google.com/) y creá un proyecto.
2. Agregá una app **Web** y copiá la configuración a tu `.env`.
3. En **Build → Authentication**:
   - Activá el proveedor **Email/Password**
   - Creá usuarios (ej. `andres@mobihouse.com` y `maria@mobihouse.com`) con contraseñas de **8+ caracteres**
4. En **Build → Firestore Database**, creá la base.
5. En **Firestore → Reglas**, publicá el contenido de `firestore.rules` del repo (lectura pública del catálogo, escritura solo admin).
6. En **Build → Storage**, activá Storage y publicá el contenido de `storage.rules` (lectura pública de imágenes, escritura solo admin).
7. El email `andres@mobihouse.com` está autorizado como admin al primer login (también en las reglas). Para otro admin, actualizá `ADMIN_EMAILS` en `src/lib/security.ts` y la regla `isAdminEmail()` en `firestore.rules`.

La primera vez que un **admin** inicia sesión, si la colección `properties` está vacía, se cargan 4 propiedades de ejemplo.

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mat0222/mobihouse.git
cd mobihouse

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editá el archivo `.env`:

```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Grok (opcional)
XAI_API_KEY=tu_api_key_aqui
XAI_MODEL=grok-3-mini-fast
```

> No subas el archivo `.env` a GitHub (ya está en `.gitignore`).

## Scripts disponibles

```bash
# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

La aplicación corre por defecto en `http://localhost:5173`.

## Cuentas

Podés crear una cuenta desde **`/registro`** o iniciar sesión en **`/login`**.

El sitio es **público para navegar** (inicio, propiedades, detalle, mapa). Acciones como favoritos, mensajes, chat IA, contactar agente o administrar requieren sesión.

| Rol | Email sugerido |
|-----|----------------|
| Admin | `andres@mobihouse.com` |
| Usuario | cualquiera registrado en `/registro` |

Usá contraseñas de 8+ caracteres. El login no muestra contraseñas de prueba.

## Seguridad

- Login y registro con **Firebase Auth** (contraseñas hasheadas por Google, no en localStorage)
- Roles en Firestore (`users/{uid}`), sin auto-escalada a admin
- Reglas: lectura pública del catálogo de propiedades; solo admin escribe propiedades/imágenes
- Acciones de usuario (favoritos, contacto, chat) requieren autenticación
- Login con bloqueo tras 5 intentos fallidos
- API Grok: requiere token Firebase, rate limit, validación de payload
- Sanitización de textos/URLs al guardar propiedades
- Sin credenciales demo visibles en la UI

## Estructura del proyecto

```
mobihouse/
├── server/                 # Proxy seguro para la API de Grok
├── src/
│   ├── components/         # UI reutilizable
│   ├── contexts/           # Auth, propiedades (Firebase), favoritos
│   ├── data/               # Seed inicial de propiedades
│   ├── hooks/
│   ├── layouts/
│   ├── lib/                # Configuración de Firebase
│   ├── pages/
│   └── services/           # Firestore + Grok
├── .env.example
└── vite.config.ts
```

## Asistente IA (Grok)

El chat usa un proxy interno en `/api/grok/chat` para no exponer la API key. Funciona con `npm run dev` y `npm run preview`.

## Despliegue

1. Ejecutá `npm run build`
2. Los archivos quedan en `dist/`
3. Configurá las mismas variables `VITE_FIREBASE_*` en tu hosting
4. Para el chat con Grok en producción, necesitás un backend que exponga `/api/grok/chat`

## Licencia

Uso libre con atribución.
