# Guía de Implementación de Imagen de Perfil

## Estado: Implementado ✅

### 1. Almacenamiento y Persistencia

- **Almacenamiento**: Sistema de archivos local en `/public/uploads/avatars/`.
- **Persistencia**: Datos de usuario y rutas de avatar almacenados en `data/users.json`.
- **Validación**: Máx 2MB, solo imágenes `jpg/png/webp`.

### 2. Backend

- **Dependencias**: `multer` instalado y configurado.
- **Rutas**:
  - `GET /profile`: Renderiza perfil con lógica de modal y avatar.
  - `POST /profile/avatar`: Maneja la subida de archivos y actualiza la base de datos JSON.
  - `POST /profile/avatar/delete`: Elimina archivo de avatar y actualiza base de datos.
- **Feedback**: Mensajes flash basados en sesión para notificaciones de éxito/error.

### 3. Frontend

- **Vista**: `profile.ejs` actualizado con:
  - Visualización de avatar con botón "Cambiar".
  - **Interfaz Modal** para subir/eliminar avatares (sin página separada).
  - Visualización de mensajes flash para feedback del usuario.
- **Activos**: Avatar SVG por defecto añadido en `/public/images/default-avatar.svg`.
- **DiceBear**: Eliminado completamente.
