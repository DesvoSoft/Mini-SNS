// =============================== IMPORTS ===============================
const express = require("express"); // --- Framework servidor web
const app = express();

const path = require("path"); // --- Manejo de rutas y directorios
const fs = require("fs"); // --- Lectura de archivos locales
const morgan = require("morgan"); // --- Logs HTTP en consola
const cookieParser = require("cookie-parser"); // --- Manejo de cookies
const session = require("express-session"); // --- Manejo de sesiones
const multer = require("multer"); // --- Manejo de subida de archivos

const DATA_FILE = path.join(__dirname, "data", "users.json");

// =============================== DATA PERSISTENCE HELPERS ===============================
function loadUsers() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data).users || [];
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    const data = JSON.stringify({ users }, null, 2);
    fs.writeFileSync(DATA_FILE, data, "utf-8");
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

function getUserByUsername(username) {
  const users = loadUsers();
  return users.find((u) => u.username === username);
}

function updateUserAvatar(username, avatarPath) {
  const users = loadUsers();
  const userIndex = users.findIndex((u) => u.username === username);

  if (userIndex !== -1) {
    users[userIndex].avatarPath = avatarPath;
    saveUsers(users);
    return true;
  }
  return false;
}

// =============================== MULTER CONFIG ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "public", "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, req.session.username + "_" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Error: File upload only supports images (jpeg, jpg, png, webp)!"
      )
    );
  },
});

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
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

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

  // Cargar usuarios desde JSON
  const users = loadUsers();

  // Buscar coincidencia
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.username = user.username;
    req.session.avatarPath = user.avatarPath; // Store avatar in session
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
    const user = getUserByUsername(req.session.username);
    const userPosts = posts.filter((p) => p.username === req.session.username);

    // Get flash messages from session
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    delete req.session.successMessage;
    delete req.session.errorMessage;

    return res.render("profile", {
      username: req.session.username,
      user: user, // Pass full user object
      posts: userPosts,
      successMessage: successMessage,
      errorMessage: errorMessage,
    });
  } else {
    return res.redirect("/");
  }
});

// =============================== AVATAR UPLOAD ===============================
app.get("/profile/avatar", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const user = getUserByUsername(req.session.username);

  // Get flash messages from session
  const successMessage = req.session.successMessage;
  const errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;

  res.render("profile-avatar", {
    username: req.session.username,
    user: user,
    successMessage: successMessage,
    errorMessage: errorMessage,
  });
});

app.post("/profile/avatar", upload.single("avatar"), (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  if (!req.file) {
    req.session.errorMessage = "No file uploaded. Please select an image.";
    return res.redirect("/profile");
  }

  // Path relative to public folder for frontend use
  const avatarPath = "/uploads/avatars/" + req.file.filename;

  // Update user data
  updateUserAvatar(req.session.username, avatarPath);

  // Update session
  req.session.avatarPath = avatarPath;
  req.session.successMessage = "Avatar updated successfully!";

  res.redirect("/profile");
});

app.post("/profile/avatar/delete", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const user = getUserByUsername(req.session.username);

  if (user && user.avatarPath) {
    // Delete the physical file
    const filePath = path.join(__dirname, "public", user.avatarPath);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting avatar file:", error);
    }

    // Update database
    updateUserAvatar(req.session.username, null);

    // Update session
    req.session.avatarPath = null;
    req.session.successMessage = "Avatar deleted successfully!";
  }

  res.redirect("/profile");
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
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
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
