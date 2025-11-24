// =============================== IMPORTS ===============================
const express = require("express"); // --- Framework servidor web
const app = express();

const path = require("path"); // --- Manejo de rutas y directorios
const fs = require("fs"); // --- Lectura de archivos locales
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

// =============================== MOCK DATA ===============================
const posts = [
  { username: "Tom", content: "Mi primer post" },
  { username: "Alice", content: "K-Lab <3" },
  { username: "Wendy", content: "Learning EJS" },
  { username: "Johan", content: "감사합니다" },
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
  if (req.session.username) {
    res.render("posts", { posts, username: req.session.username, categories }); // --- Renderiza posts.ejs con lista
  } else {
    res.redirect("/");
  }
});

// Post submit
app.post("/posts", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const content = req.body.content?.trim();

  if (content) {
    posts.unshift({ username: req.session.username, content });
  }

  res.redirect("/posts");
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

// Documentation
app.get("/docs", (req, res) => {
  const englishDocs = loadDocs(path.join(__dirname, "docs"));
  const spanishDocs = loadDocs(path.join(__dirname, "docs_es"));

  res.render("docs", {
    username: req.session.username,
    englishDocs,
    spanishDocs,
  });
});

function loadDocs(directoryPath) {
  try {
    if (!fs.existsSync(directoryPath)) {
      return [];
    }

    return fs
      .readdirSync(directoryPath)
      .filter((file) => file.toLowerCase().endsWith(".md"))
      .map((fileName) => {
        const fullPath = path.join(directoryPath, fileName);
        const content = fs.readFileSync(fullPath, "utf-8");
        const parsedName = path.parse(fileName).name;

        return {
          fileName,
          title: toTitleCase(parsedName.replace(/_/g, " ")),
          slug: slugify(parsedName),
          content: content.trim(),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  } catch (error) {
    console.error(`Error loading docs from ${directoryPath}:`, error);
    return [];
  }
}

function toTitleCase(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();
}

// =============================== SERVIDOR ===============================
app.listen(4000, "0.0.0.0", () => {
  console.log("Running at: http://localhost:4000");
});
