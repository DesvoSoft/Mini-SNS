# Contribuyendo a Mini SNS

## Estándares

### Autenticación

- **Sesión**: Usa `req.session.username` para verificar autenticación.
- **Middleware**: Futuro: Centralizar verificaciones de sesión.

### Datos

- **Mocks**: `posts` están en memoria y se reinician al reiniciar.
- **Categorías**: Definidas en `app.js`.

### UI/UX

- **Estilos**: Usa clases de `_ui-helpers.ejs` (`btn`, `page-shell`).
- **Iconos**: Usa emojis estándar o iconos SVG consistentes con el tema.

### Pruebas

- **Manuales**:
  1.  Iniciar sesión (Desvo/123).
  2.  Crear una publicación.
  3.  Revisar perfil.
  4.  Cerrar sesión.
