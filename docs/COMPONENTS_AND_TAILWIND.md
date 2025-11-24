# Componentes y Tailwind en Mini-SNS

Este documento resume los componentes reutilizables disponibles en `views/components` y cómo se usa TailwindCSS en las vistas EJS para mantener estilos consistentes.

## Componentes EJS

### `_header.ejs`
Barra fija superior con el título y, si hay sesión, muestra el nombre de usuario y un botón de logout. Inclúyelo al comienzo del `body` en todas las páginas autenticadas.

### `_footer.ejs`
Pie fijo inferior con un mensaje y la fecha/hora en vivo. Debe ir al final del `body` para mantener el mismo cierre visual.

### `_gfont.ejs`
Carga la familia `Quantico` desde Google Fonts y define la clase utilitaria `font-body-gamer` usada en títulos y textos destacados.

### `_ui-helpers.ejs`
Bloque de estilos compartidos que normaliza layout y controles:
- `.app-body` aplica el gradiente animado de fondo y el espacio necesario para el header y footer fijos.
- `.page-shell` y `.page-shell--narrow` crean contenedores centrados con blur y sombra.
- `.page-title`, `.action-row`, `.btn` (y variantes `btn-primary`, `btn-secondary`, `btn-success`) definen tipografía y botones consistentes.
- `.content-card` agrupa tarjetas con borde y blur.
- `.input-label` y `.input-field` estandarizan campos de formulario, con foco resaltado.
- `.textarea-primary` mantiene estilo coherente en áreas de texto.

Incluye este archivo en las páginas que usen esos estilos para evitar definiciones duplicadas.

### `_categories.ejs`
Renderiza las categorías con utilidades Tailwind creadas vía `@layer components` dentro de un bloque `<style type="text/tailwindcss">`. Útil en páginas que listan o filtran contenido.

### `feed.ejs`
Tarjeta de post individual con título, contenido y caja de comentarios. Depende de las clases base de Tailwind y del fondo provisto por `.app-body`.

## Uso de TailwindCSS

- **Carga**: Todas las vistas incluyen Tailwind a través del CDN `<script src="https://cdn.tailwindcss.com"></script>`, sin build step.
- **Extensiones locales**: Algunos componentes declaran estilos dentro de `<style type="text/tailwindcss">` (por ejemplo, `_categories.ejs`) para aprovechar `@apply` y generar utilidades a medida.
- **Helpers globales**: `_ui-helpers.ejs` utiliza CSS tradicional para layout y controles, complementando las utilidades de Tailwind cuando no se requiere `@apply`.
- **Fondos animados**: `public/css/bg.css` define `gradientShift` y la clase `.animated-bg`, consumida por `.app-body` para garantizar un único origen del fondo animado.

## Buenas prácticas

- Reutiliza `_header`, `_footer` y `_ui-helpers` en cada página para mantener coherencia visual.
- Prefiere `.input-field` y `.textarea-primary` para formularios en lugar de definir estilos ad-hoc.
- Coloca personalizaciones de Tailwind en bloques `type="text/tailwindcss"` dentro de componentes específicos para evitar estilos duplicados.
- Conserva el CDN de Tailwind a nivel de página; no hay archivos de configuración ni compilación adicionales.
