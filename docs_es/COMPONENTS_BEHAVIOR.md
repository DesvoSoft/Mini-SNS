# Funcionamiento de los componentes EJS

Este documento describe qué hace cada componente en `views/components`, qué datos espera y en qué vistas se usa. Úsalo como referencia rápida para mantener la coherencia cuando se agreguen nuevas páginas o se refactoricen las existentes.

## `_header.ejs`
- **Rol**: Barra superior pegajosa con el título "Mini SNS" y la acción de sesión.
- **Datos requeridos**: `username` (string opcional). Si existe, muestra el nombre y un botón de `Logout`; si no, el botón dice `Login` y regresa a `/`.
- **Dependencias**: Utiliza clases definidas en `_ui-helpers.ejs` (`app-header`, `btn` y variantes).
- **Dónde se usa**: Todas las vistas de nivel página (`index.ejs`, `posts.ejs`, `write.ejs`, `profile.ejs`). Siempre inclúyelo inmediatamente después de abrir el `<body>` para que reserve espacio al gradiente de fondo.

## `_footer.ejs`
- **Rol**: Pie de página fijo que muestra la marca y un reloj en vivo.
- **Datos requeridos**: Ninguno.
- **Dependencias**: Requiere el bloque de estilos de `_ui-helpers.ejs` para la clase `app-footer`. Usa JavaScript inline para actualizar la hora cada segundo.
- **Dónde se usa**: Todas las vistas de nivel página. Colócalo al final del `<body>` para que el contenido central respete su altura.

## `_gfont.ejs`
- **Rol**: Inyecta la fuente `Quantico` desde Google Fonts y declara la utilidad `font-body-gamer`.
- **Datos requeridos**: Ninguno.
- **Dependencias**: Depende del CDN de Google Fonts; no necesita otras hojas de estilo.
- **Dónde se usa**: Todas las vistas. Inclúyelo en `<head>` antes de los estilos locales para asegurar la disponibilidad de la fuente.

## `_ui-helpers.ejs`
- **Rol**: Hoja de estilos compartida con helpers de layout, botones, formularios y tarjetas.
- **Datos requeridos**: Ninguno.
- **Dependencias**: Se apoya en Tailwind CDN para el reset básico, pero define CSS plano para asegurar consistencia aunque falte Tailwind.
- **Dónde se usa**: Todas las vistas. Cárgalo en `<head>` después de Tailwind y `_gfont.ejs`.

## `_categories.ejs`
- **Rol**: Renderiza el listado de categorías como chips clicables con estilos `@apply` para hover y selección.
- **Datos requeridos**: `categories` (array de strings). No aplica lógica de selección; solo muestra etiquetas.
- **Dependencias**: Utiliza `@layer components` dentro de `<style type="text/tailwindcss">`, por lo que requiere que Tailwind esté disponible en la página.
- **Dónde se usa**: `posts.ejs` (listado) y `write.ejs` (formulario), pero puede reutilizarse en nuevas vistas de filtrado.

## `feed.ejs`
- **Rol**: Tarjeta de post individual (autor, contenido, acciones ficticias y caja de comentario rápida).
- **Datos requeridos**: `post` con propiedades `username` y `content`.
- **Dependencias**: Espera que el contenedor padre le proporcione el fondo (`app-body`) y las utilidades de botón/inputs definidas en `_ui-helpers.ejs`.
- **Dónde se usa**: `posts.ejs` mediante `include("feed", { post })`. Puede reutilizarse para feeds paginados o resúmenes.

## Convenciones de uso
- Mantén el orden de includes en las vistas: primero Tailwind CDN, luego `_gfont.ejs`, después `_ui-helpers.ejs` y finalmente hojas de estilo específicas (`/css/bg.css`).
- Cuando crees nuevas páginas, replica la estructura actual (`<body class="app-body">`, header, `<main class="page-shell">`, footer) para que el fondo animado y el espaciado sean coherentes.
- Si un componente necesita nuevos datos, documenta las props esperadas en este archivo y agrega valores de ejemplo en la vista que lo consuma para evitar fallos silenciosos.
