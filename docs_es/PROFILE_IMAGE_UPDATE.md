# Guía de Implementación de Imagen de Perfil

## Lista de Verificación

### 1. Almacenamiento y Validación

- [ ] **Almacenamiento**: Usa `/public/uploads` o almacenamiento en la nube.
- [ ] **Validación**: Máx 2MB, `jpg/png/webp`.

### 2. Backend

- [ ] **Dependencias**: Instala `multer`.
- [ ] **Rutas**:
  - `GET /profile/avatar`: Formulario de edición.
  - `POST /profile/avatar`: Manejar subida.

### 3. Frontend

- [ ] **Vista**: Actualiza `profile.ejs` con enlace de edición.
- [ ] **Formulario**: Crea `profile-avatar.ejs` con entrada de archivo.
- [ ] **Estilos**: Usa `.avatar-ring` para estilos.
