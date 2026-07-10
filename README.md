# MobiHouse

Plataforma web inmobiliaria desarrollada con React y TypeScript. Permite explorar propiedades, ver detalles, gestionar favoritos, consultar un mapa interactivo y conversar con un asistente de inteligencia artificial impulsado por Grok.

## Características

- **Inicio** con hero, buscador y sección de contacto
- **Catálogo de propiedades** con filtros por precio, tipo, habitaciones y búsqueda
- **Detalle de propiedad** con galería de imágenes, mapa, amenities y contacto con agente
- **Mapa interactivo** con ubicación de propiedades (Leaflet + OpenStreetMap)
- **Favoritos** persistentes en el navegador
- **Mensajes** entre usuario y contactos
- **Asistente IA** con Grok (xAI) para consultas sobre propiedades
- **Panel administrativo** para gestionar propiedades y usuarios
- **Autenticación** con roles de usuario y administrador

## Tecnologías

| Área | Stack |
|------|--------|
| Frontend | React 19, TypeScript, Vite |
| Estilos | Tailwind CSS 4 |
| Routing | React Router 7 |
| Mapas | Leaflet, React Leaflet |
| IA | Grok API (xAI) |
| Iconos | React Icons |

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- API key de xAI (opcional, para el asistente IA)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mobihouse.git
cd mobihouse

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editá el archivo `.env` y agregá tu API key de Grok:

```env
XAI_API_KEY=tu_api_key_aqui
XAI_MODEL=grok-3-mini-fast
```

> La API key se obtiene en [console.x.ai](https://console.x.ai/). No la subas a GitHub.

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

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `andres@mobihouse.com` | `admin123` |
| Usuario | `maria@mobihouse.com` | `user1234` |

El panel administrativo está disponible en `/admin` (solo usuarios con rol admin).

## Estructura del proyecto

```
mobihouse/
├── server/              # Proxy seguro para la API de Grok
├── src/
│   ├── components/      # UI reutilizable (Navbar, PropertyCard, ChatWidget...)
│   ├── contexts/        # Estado global (auth, propiedades, favoritos)
│   ├── data/            # Datos mock iniciales
│   ├── hooks/           # Hooks personalizados
│   ├── layouts/         # Layouts de la app y admin
│   ├── pages/           # Páginas de la aplicación
│   └── services/        # Servicios del cliente (Grok)
├── .env.example         # Plantilla de variables de entorno
└── vite.config.ts       # Configuración de Vite + plugin Grok
```

## Asistente IA (Grok)

El chat utiliza un proxy interno en `/api/grok/chat` para no exponer la API key en el frontend. El asistente recibe contexto del catálogo de propiedades y responde en español.

**Importante:** el proxy funciona con `npm run dev` y `npm run preview`. Si desplegás solo archivos estáticos, necesitás un backend que exponga el mismo endpoint o migrar el proxy a tu servidor.

## Despliegue

1. Ejecutá `npm run build`
2. Los archivos generados quedan en la carpeta `dist/`
3. Para producción con IA, asegurate de que el servidor exponga `/api/grok/chat` con la variable `XAI_API_KEY` configurada

## Licencia

Proyecto académico / portfolio. Uso libre con atribución.
