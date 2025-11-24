# Componentes y Tailwind

## Componentes Principales

| Componente            | Rol                                                                | Uso                                                  |
| :-------------------- | :----------------------------------------------------------------- | :--------------------------------------------------- |
| **`_header.ejs`**     | Barra superior adhesiva con título y acciones de autenticación.    | Dentro de `<body>`, primer elemento.                 |
| **`_footer.ejs`**     | Barra inferior fija con marca y reloj en vivo.                     | Dentro de `<body>`, último elemento.                 |
| **`_gfont.ejs`**      | Carga la fuente `Quantico` y define `font-body-gamer`.             | Dentro de `<head>`.                                  |
| **`_ui-helpers.ejs`** | CSS compartido para diseño, botones y tarjetas.                    | Dentro de `<head>`, después de Tailwind.             |
| **`_categories.ejs`** | Renderiza chips de categorías.                                     | En listas/formularios. Requiere `@layer components`. |
| **`feed.ejs`**        | Tarjeta de publicación con autor, contenido y caja de comentarios. | Incluido en bucles (ej. `posts.ejs`).                |

## Uso de Tailwind

- **CDN**: Cargado vía `<script src="https://cdn.tailwindcss.com"></script>`.
- **Utilidades Personalizadas**: Definidas en `_ui-helpers.ejs` (diseño/botones) o componentes específicos (ej. `_categories.ejs`).
- **Fondo**: `public/css/bg.css` maneja el gradiente animado vía `.app-body`.

## Mejores Prácticas

1.  **Estructura**: `<body>` -> `_header` -> `<main class="page-shell">` -> `_footer`.
2.  **Estilos**: Usa clases de `_ui-helpers.ejs` (`btn`, `input-field`) para consistencia.
3.  **Extensiones**: Agrega estilos específicos del componente en bloques `<style type="text/tailwindcss">`.
