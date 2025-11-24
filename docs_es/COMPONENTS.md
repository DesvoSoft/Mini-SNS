# Componentes y Sistema de Diseño

Este documento ofrece una inmersión profunda en la arquitectura de interfaz de usuario de Mini SNS, incluyendo nuestro enfoque de estilo híbrido, tokens de diseño y referencia de componentes.

## Sistema de Diseño

### Tipografía

- **Familia de Fuentes**: `Quantico` (Google Fonts)
- **Clases**:
  - `font-body-gamer`: Texto principal del cuerpo.
- **Uso**: Aplicado globalmente a `body` y componentes específicos.

### Colores y Tema

- **Fondo**: Gradiente Animado (`linear-gradient(-45deg, #0d1117, #c1eb74, #00d2ff, #0d1117)`)
- **Glassmorphism**: Uso intensivo de `backdrop-blur`, fondos semitransparentes (ej. `bg-gray-900/40`) y bordes.
- **Acentos**:
  - **Cian**: `#00d2ff` / `text-cyan-500` (Enlaces, Resaltados)
  - **Lima**: `#c1eb74` / `text-lime-400` (Marca, Éxito)
  - **Oscuro**: `#0d1117` (Fondo base)

## Arquitectura CSS

Usamos un **Enfoque de Estilo Híbrido** que consta de 4 patrones distintos. Entender esto es crucial para contribuir.

### 1. Utilidad Tailwind en Línea

_Usado para: Diseños, elementos únicos y componentes simples._

- **Dónde**: `_header.ejs`, `_footer.ejs`, plantillas de página.
- **Ejemplo**: `<div class="flex items-center space-x-4">`
- **Pros**: Desarrollo rápido, estilos explícitos.

### 2. Ayudantes Globales (CSS Puro)

_Usado para: Elementos de UI comunes que necesitan consistencia en toda la aplicación._

- **Dónde**: `views/components/_ui-helpers.ejs`
- **Método**: Clases CSS estándar definidas en un bloque `<style>`.
- **Clases Disponibles**:

  **Diseño**

  - `.app-body`: Establece el fondo de gradiente animado y la fuente global.
  - `.page-shell`: Contenedor principal con efecto glassmorphism, ancho máximo y relleno.
  - `.page-shell--narrow`: Modificador para contenido más estrecho (ej. formularios de login/registro).
  - `.page-title`: Estilo estándar para encabezados de página (grande, centrado, cian).
  - `.action-row`: Contenedor flexible para botones de acción (espacio entre elementos).
  - `.action-row--left`: Modificador para alinear acciones al inicio.
  - `.content-card`: Contenedor semitransparente para secciones distintas de contenido.

  **Botones**

  - `.btn`: Clase base para botones (flex, redondeado, transición).
  - `.btn-primary`: Fondo azul (Acción).
  - `.btn-secondary`: Fondo gris (Neutral).
  - `.btn-success`: Fondo verde (Confirmación/Enviar).

  **Formularios**

  - `.input-label`: Estilo de etiqueta (negrita, gris claro).
  - `.input-field`: Entrada de texto estándar (fondo oscuro, borde, anillo de foco).
  - `.input-ghost`: Entrada minimalista para menos énfasis.
  - `.textarea-primary`: Estilo estándar de área de texto coincidente con las entradas.

### 3. Clases de Componentes (@apply)

_Usado para: Componentes complejos con muchos sub-elementos repetidos._

- **Dónde**: `views/components/_categories.ejs`
- **Método**: Directiva `@apply` de Tailwind dentro de `<style type="text/tailwindcss">`.
- **Clases Disponibles**:
  - `.category-wrap`: Contenedor con glassmorphism y borde.
  - `.category-title`: Encabezado de sección con espaciado y color cian.
  - `.category-grid`: Contenedor flex wrap para píldoras.
  - `.category-pill`: Chip de categoría interactivo con efectos hover y sombra.
  - `.category-dot`: Punto brillante decorativo dentro de la píldora.

### 4. Estilos Externos

_Usado para: Animaciones globales, restablecimientos base y estilos heredados._

- **Dónde**: `public/css/bg.css`, `public/css/posts.css`, `public/css/global.css`, `public/css/write.css`
- **Contenido**:
  - **Fondo**: Animaciones de fotogramas clave (`@keyframes gradientShift`) en `bg.css`.
  - **Publicaciones (`posts.css`)**:
    - `.post`: Estilo de contenedor heredado (a menudo anulado por Tailwind).
    - `.add-comment`: Estilo de botón de envío azul.
    - `.comments`: Contenedor flexible para comentarios.
    - `.comment-count`: Texto gris pequeño para recuentos.
  - **Global (`global.css`)**:
    - Estilos base heredados para `body`, `header`, `footer` y `form`.
    - _Nota: A menudo anulado por clases de Tailwind en componentes más nuevos._
  - **Escribir (`write.css`)**:
    - Estilos de formulario específicos para la página "Escribir Publicación" (`form`, `input`, `textarea`, `button`).
    - _Nota: Estilo heredado, probablemente reemplazado por Tailwind en formularios más nuevos._

---

## Referencia de Componentes

### Diseño Principal

#### `_header.ejs`

- **Rol**: Barra de navegación superior adhesiva.
- **Props**: `username` (String, opcional) - Si está presente, muestra el menú de usuario; de lo contrario no muestra nada.
- **Estilo**:
  - **Contenedor**: `fixed top-0 w-full z-10 bg-[#0D1117] border-b-2 border-[#34495e]`
  - **Marca**: `text-lime-400 hover:animate-pulse`

#### `_footer.ejs`

- **Rol**: Barra inferior fija con derechos de autor y reloj.
- **Props**: Ninguno.
- **Estilo**: `fixed bottom-0 w-full bg-gray-900 border-t-2 border-gray-700`
- **Comportamiento**: Contiene un script para actualizar `#datetime` cada segundo.

#### `_ui-helpers.ejs`

- **Rol**: **CRÍTICO**. Debe incluirse en `<head>` para cargar clases CSS globales.
- **Exportaciones**: `.page-shell`, `.btn-*`, `.input-*`.

### Componentes de Funcionalidad

#### `_categories.ejs`

- **Rol**: Muestra una lista de categorías como "chips" o "píldoras".
- **Props**: `categories` (Array de Strings).
- **Estilo**: Usa **Patrón #3 (@apply)**.
  - `.category-wrap`: Contenedor de vidrio.
  - `.category-pill`: Chip interactivo con efectos hover.

#### `feed.ejs` (Tarjeta de Publicación)

- **Rol**: Renderiza una sola publicación.
- **Props**: `post` (Objeto).
- **Estilo**:
  - Usa `bg-gray-800` con `rounded-lg` y `shadow-lg`.
  - Las imágenes son `object-cover`.
