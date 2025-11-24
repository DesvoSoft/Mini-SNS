// =============================== IMPORTS ===============================
const express = require("express"); // --- Framework servidor web
const app = express();

const path = require("path"); // --- Manejo de rutas y directorios
const morgan = require("morgan"); // --- Logs HTTP en consola
const cookieParser = require("cookie-parser"); // --- Manejo de cookies
const session = require("express-session"); // --- Manejo de sesiones

const categories = [
  "General",
  "Announcements",
  "Tips & Tricks",
  "Feedback",
  "Releases",
];

// =============================== CONFIGURACION EJS ===============================
app.set("view engine", "ejs"); // --- EJS motor de plantillas
app.set("views", path.join(__dirname, "views"));

// =============================== ARCHIVOS ESTATICOS ===============================
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));

// =============================== MIDDLEWARES ===============================
app.use(morgan("common")); // --- Log de cada request
app.use(cookieParser()); // --- Manejo de cookies

app.use(
  session({
    secret: "mySecretKey", // --- Clave para firmar la sesion
    resave: false, // --- No guarda sesion si no hay cambios
    saveUninitialized: false, // --- No guarda sesiones vacias
    cookie: {
      maxAge: 1000 * 60 * 10, // --- 10 min
    },
  })
);

app.use(express.urlencoded({ extended: true })); // --- Procesa datos de formularios (POST)

// =============================== AUTENTICACION MOCK ===============================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Usuarios mock
  const users = [
    { username: "Desvo", password: "123", redirect: "/" },
    { username: "Tom", password: "123456", redirect: "/posts" },
  ];

  // Buscar coincidencia
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.username = user.username;
    return res.redirect(user.redirect);
  } else {
    // --- Guarda mensaje de error en la sesion
    req.session.loginError = "Usuario o contraseña incorrectos.";
    return res.redirect("/");
  }
});

// =============================== LOGOUT ===============================
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.clearCookie("connect.sid"); // --- Limpia cookie de sesion
    res.redirect("/");
  });
});

// =============================== PERFIL ===============================
app.get("/profile", (req, res) => {
  if (req.session.username) {
    return res.render("profile", { username: req.session.username });
  } else {
    return res.redirect("/");
  }
});

// =============================== ROUTING ===============================
// Main
app.get("/", (req, res) => {
  const loginError = req.session.loginError;
  delete req.session.loginError;

  res.render("index", {
    username: req.session.username,
    loginError: loginError,
  });
});

// Posts
app.get("/posts", (req, res) => {
  const posts = [
    { username: "Tom", content: "Mi primer post" },
    { username: "Alice", content: "K-Lab <3" },
    { username: "Wendy", content: "Learning EJS" },
    { username: "Johan", content: "감사합니다" },
  ];

  if (req.session.username) {
    res.render("posts", { posts, username: req.session.username, categories }); // --- Renderiza posts.ejs con lista
  } else {
    res.redirect("/");
  }
});

// Write
app.get("/write", (req, res) => {
  if (req.session.username) {
    res.render("write", { username: req.session.username, categories });
    // res.sendFile(path.join(__dirname, "public", "write.html"));
  } else {
    res.redirect("/");
  }
});

// =============================== SERVIDOR ===============================
app.listen(4000, "0.0.0.0", () => {
  console.log("Running at: http://localhost:4000");
});
