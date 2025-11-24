# Guía para agregar/actualizar la imagen de perfil

Estos pasos orientan la implementación de una foto de perfil editable para usuarios autenticados.

## 1) Fuente de la imagen
- **Mock rápido**: Acepta una URL remota y guárdala en la sesión (`req.session.avatarUrl`).
- **Persistencia**: Si se agrega almacenamiento real, usa disco (`/public/uploads`) o un bucket. Evita guardar binarios en sesión.
- **Validación**: Asegura tamaño máximo (ej. 2 MB) y tipos permitidos (`image/jpeg`, `image/png`, `image/webp`).

## 2) Back-end
- **Dependencias**: Añade `multer` para manejo de `multipart/form-data` si se soportan archivos.
- **Rutas sugeridas**:
  - `GET /profile/avatar`: Renderiza un formulario con la imagen actual y campo de carga o URL.
  - `POST /profile/avatar`: Procesa el formulario, valida el archivo/URL, guarda la ruta (sesión o base de datos) y redirige a `/profile`.
- **Protección**: Requiere sesión activa. Usa middleware para reutilizar la validación en cualquier ruta de perfil.

## 3) Vistas
- **`profile.ejs`**:
  - Muestra la imagen con un placeholder por defecto (ej. `/css/avatar-placeholder.png`).
  - Agrega enlace hacia `GET /profile/avatar` para editar.
- **`profile-avatar.ejs` (nueva)**:
  - Formulario con `input type="file"` y/o `input type="url"`.
  - Previsualización en vivo usando un `<img>` que reaccione al cambio del input.

## 4) Estilos y componentes
- Reusa las utilidades de `_ui-helpers.ejs` para botones y inputs.
- Crea una clase utilitaria `.avatar-ring` para bordes consistentes (`border-4 border-cyan-300 rounded-full`).
- Si se añade un componente EJS reutilizable (`_avatar.ejs`), documenta sus props (`src`, `alt`, `size`) en `docs/COMPONENTS_BEHAVIOR.md`.

## 5) Testing manual
- Subir una imagen válida y confirmar que se renderiza en `profile.ejs`.
- Probar un archivo con tipo no permitido y validar que muestre error.
- Cargar una URL quebrada y verificar fallback al placeholder.
- Confirmar que cerrar sesión limpia la ruta del avatar almacenada en sesión.

## 6) Checklist de despliegue
- Limpiar `/public/uploads` en `.gitignore` para evitar subir archivos locales.
- Añadir límite de tamaño en `multer` (`limits.fileSize`) y manejo de errores global.
- Si se usa CDN/bucket, documentar variables de entorno (ej. `AVATAR_BUCKET_URL`) en `.env.example` y README.
