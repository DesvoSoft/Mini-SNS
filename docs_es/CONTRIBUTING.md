# Contribuyendo a Mini SNS

¡Gracias por tu interés en contribuir a Mini SNS! Esta guía te ayudará a entender nuestros estándares de desarrollo y flujo de trabajo.

## Tabla de Contenidos

- [Configuración de Desarrollo](#configuración-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Directrices de Prueba](#directrices-de-prueba)
- [Proceso de Pull Request](#proceso-de-pull-request)

---

## Configuración de Desarrollo

### Prerrequisitos

1. **Node.js** (versión LTS)
2. **MongoDB** (6.0+) ejecutándose localmente
3. **Git** para control de versiones

### Configuración Local

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd mini-sns

# Instalar dependencias
npm install

# Iniciar MongoDB
mongod  # o: brew services start mongodb-community

# Iniciar la aplicación
npm start
```

La aplicación se conectará a `mongodb://localhost:27017/mydb` y auto-sembrará usuarios desde `data/users.json` si la base de datos está vacía.

---

## Estándares de Código

### Autenticación

- **Gestión de Sesiones**: Siempre verificar `req.session.username` para autenticación.
- **Rutas Protegidas**: Redirigir a `/` si `!req.session.username`.
- **Futuro**: Centralizar verificaciones de autenticación con middleware.

**Ejemplo**:

```javascript
app.get("/protegido", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }
  // ... lógica de ruta
});
```

### Operaciones de Base de Datos

- **Usar Async/Await**: Todas las operaciones MongoDB deben usar `async/await`.
- **Manejo de Errores**: Envolver llamadas a base de datos en bloques try/catch.
- **Modelos**: Siempre interactuar con la base de datos a través de modelos Mongoose.

**Ejemplo**:

```javascript
app.post("/posts", async (req, res) => {
  try {
    await Feed.create({ author: req.session.username, content });
    res.redirect("/posts");
  } catch (error) {
    console.error("Error creando post:", error);
    res.status(500).send("Error del servidor");
  }
});
```

### Modelos de Datos

**Colecciones Actuales:**

- `users` - Cuentas de usuario (username, password, avatarPath, redirect)
- `feed` - Publicaciones y comentarios embebidos

**Directrices de Esquema:**

- Usar nombres de campos descriptivos
- Agregar validación donde sea apropiado (`required`, `unique`)
- Usar valores predeterminados para campos opcionales
- Documentar cambios de esquema en `docs/ARCHITECTURE.md`

### Estándares UI/UX

- **Estilos**: Usar clases de `_ui-helpers.ejs` (`.btn-*`, `.page-shell`, `.input-*`).
- **Componentes**: Seguir el enfoque de estilo híbrido de 4 patrones (ver `COMPONENTS.md`).
- **Iconos**: Usar emojis o iconos SVG consistentes con el tema cyan/lime.
- **Mensajes Flash**: Usar mensajes flash basados en sesión para retroalimentación del usuario.

**Ejemplo**:

```javascript
req.session.successMessage = "¡Acción completada!";
res.redirect("/profile");
```

---

## Directrices de Prueba

### Lista de Verificación de Pruebas Manuales

Antes de enviar un pull request, verificar:

1. **Autenticación**

   - [ ] Login con `Desvo/123` y `Tom/1234`
   - [ ] Logout limpia la sesión
   - [ ] Rutas protegidas redirigen usuarios no autenticados

2. **Publicaciones**

   - [ ] Crear una nueva publicación desde `/write`
   - [ ] Publicación aparece en feed en `/posts`
   - [ ] Publicaciones ordenadas por más reciente primero

3. **Comentarios**

   - [ ] Agregar un comentario a una publicación
   - [ ] Comentario aparece inmediatamente después de recargar página
   - [ ] Recuento de comentarios se actualiza correctamente

4. **Perfil**

   - [ ] Vista de perfil muestra publicaciones del usuario
   - [ ] Subir avatar (máx 2MB, jpg/png/webp)
   - [ ] Eliminar avatar revierte a predeterminado

5. **Persistencia de Base de Datos**
   - [ ] Reiniciar servidor
   - [ ] Verificar que los datos persisten (posts, comentarios, avatares)

### Verificación MongoDB

Usar MongoDB Compass o mongo shell para inspeccionar datos:

```bash
mongosh
use mydb
db.users.find()
db.feed.find()
```

---

## Proceso de Pull Request

### Antes de Enviar

1. **Nomenclatura de Ramas**: Usar nombres descriptivos
   - `feature/sistema-comentarios`
   - `fix/subida-avatar`
   - `docs/actualizar-readme`
2. **Mensajes de Commit**: Claros, tiempo presente
   - "Agregar función comentarios" (Bien)
   - "Agregados comentarios" (Mal)
3. **Probar Localmente**: Completar la lista de verificación de pruebas manuales
4. **Actualizar Docs**: Si cambiaste funcionalidad, actualizar archivos `.md` relevantes

```bash
# Flujo de Trabajo de Ejemplo
git checkout -b feature/funcion-increible
# ... hacer cambios ...
git add .
git commit -m "Implementar función increíble"
git push origin feature/funcion-increible
```

### Lista de Verificación PR

- [ ] Código sigue patrones y convenciones existentes
- [ ] Todas las rutas usan async/await para operaciones de base de datos
- [ ] Manejo de errores implementado
- [ ] Mensajes flash proporcionan retroalimentación al usuario
- [ ] Pruebas manuales completadas
- [ ] Documentación actualizada (si es necesario)

### Proceso de Revisión

1. Enviar PR con título y resumen descriptivos
2. Atender retroalimentación de revisores
3. Asegurar que las verificaciones CI pasen (cuando se implemente)
4. Esperar aprobación y fusión

---

## Patrones Comunes

### Agregar una Nueva Ruta

```javascript
// Ruta GET
app.get("/nueva-pagina", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const data = await Model.find();
    res.render("nueva-pagina", {
      username: req.session.username,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.redirect("/");
  }
});

// Ruta POST
app.post("/nueva-accion", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    await Model.create({ ...req.body });
    req.session.successMessage = "¡Éxito!";
    res.redirect("/pagina-exito");
  } catch (error) {
    console.error("Error:", error);
    req.session.errorMessage = "Algo salió mal.";
    res.redirect("/pagina-error");
  }
});
```

### Agregar un Nuevo Campo de Esquema

1. Actualizar el esquema Mongoose en `models/`
2. Probar con datos de semilla o creación manual
3. Actualizar documentación en `docs/ARCHITECTURE.md`
4. Considerar necesidades de migración para documentos existentes

---

## ¿Preguntas?

Si tienes preguntas sobre cómo contribuir, no dudes en:

- Abrir un issue para discusión
- Revisar documentación existente en `/docs`
- Consultar los docs en la app en `http://localhost:4000/docs`

¡Gracias por contribuir! 🎉
