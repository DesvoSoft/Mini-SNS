# Oportunidades de documentación y estandarización

Lista breve de áreas que pueden documentarse o alinearse para facilitar futuras contribuciones.

## Flujo de autenticación y sesión
- Documentar en README el comportamiento de `POST /login` (usuarios mock, redirects por rol) y `GET /logout`.
- Centralizar un middleware `requireSession` para reutilizar la validación en `/posts`, `/write`, `/profile` y nuevas rutas.

## Manejo de datos y mocks
- Explicar en una sección de "Datos de demo" que `posts` es un arreglo en memoria y cómo se recarga el estado en cada reinicio.
- Añadir instrucciones para extender las categorías (`categories`) y cómo propagar cambios a todas las vistas que las consumen.

## Estilos y UI
- Mantener un catálogo de componentes (ver `docs/COMPONENTS_BEHAVIOR.md`) y documentar cualquier nueva clase utilitaria en `_ui-helpers.ejs`.
- Estandarizar el uso de botones (`btn`, `btn-primary`, `btn-secondary`, `btn-success`) en vez de clases ad-hoc.
- Crear una guía de tamaños para títulos y contenedores (`page-title`, `page-shell`, `content-card`) para que nuevas páginas sigan el mismo layout.

## Formulario de posts
- Registrar en un README o sección dedicada que `/posts` espera `content` y cómo se limpia (`trim()`).
- Añadir ejemplos de validaciones futuras (límite de caracteres, bloqueo de HTML) y documentar el manejo de errores visible en la UI.

## Activos y assets
- Documentar la estructura de `/public` y reservar un subdirectorio para uploads (ej. `/public/uploads`) si se agrega la imagen de perfil.
- Mantener referencias a hojas de estilo comunes (`/css/bg.css`) y explicar cómo se reemplazaría Tailwind CDN por un build local si se necesita.

## Calidad y pruebas
- Definir en `package.json` o un archivo `docs/TESTING.md` cómo ejecutar `npm test` y qué cubre (actualmente validación de sintaxis con `node --check app.js`).
- Anotar pruebas manuales mínimas: login con usuarios mock, creación de post y navegación entre vistas protegidas.
