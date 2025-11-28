// =============================== IMPORTS ===============================
const express = require("express"); // --- Framework servidor web
const app = express();

const path = require("path"); // --- Manejo de rutas y directorios
const fs = require("fs"); // --- Lectura de archivos locales
const morgan = require("morgan"); // --- Logs HTTP en consola
const cookieParser = require("cookie-parser"); // --- Manejo de cookies
const session = require("express-session"); // --- Manejo de sesiones
const multer = require("multer"); // --- Manejo de subida de archivos

const Feed = require("./models/feed");
const User = require("./models/user");

// const DATA_FILE = path.join(__dirname, "data", "users.json"); // Removed

// =============================== DATA PERSISTENCE HELPERS ===============================
// Helper to seed users if DB is empty
async function seedUsers() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const DATA_FILE = path.join(__dirname, "data", "users.json");
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const users = JSON.parse(data).users || [];
        if (users.length > 0) {
          await User.insertMany(users);
          console.log("Users seeded from JSON file.");
        }
      }
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
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
// Mock data removed in favor of MongoDB

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

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mydb")
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedUsers();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// =============================== AUTENTICACION ===============================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      req.session.username = user.username;
      req.session.avatarPath = user.avatarPath;
      return res.redirect(user.redirect);
    } else {
      req.session.loginError = "Usuario o contraseña incorrectos.";
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.session.loginError = "Error en el servidor.";
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
app.get("/profile", async (req, res) => {
  if (req.session.username) {
    try {
      const user = await User.findOne({ username: req.session.username });
      // Fetch posts from DB
      const userPosts = await Feed.find({ author: req.session.username }).sort({
        createdAt: -1,
      });

      const successMessage = req.session.successMessage;
      const errorMessage = req.session.errorMessage;
      delete req.session.successMessage;
      delete req.session.errorMessage;

      return res.render("profile", {
        username: req.session.username,
        user: user,
        posts: userPosts,
        successMessage: successMessage,
        errorMessage: errorMessage,
      });
    } catch (error) {
      console.error("Profile error:", error);
      return res.redirect("/");
    }
  } else {
    return res.redirect("/");
  }
});

// =============================== AVATAR UPLOAD ===============================
app.get("/profile/avatar", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const user = await User.findOne({ username: req.session.username });

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
  } catch (error) {
    console.error("Avatar page error:", error);
    res.redirect("/profile");
  }
});

app.post("/profile/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  if (!req.file) {
    req.session.errorMessage = "No file uploaded. Please select an image.";
    return res.redirect("/profile");
  }

  const avatarPath = "/uploads/avatars/" + req.file.filename;

  try {
    await User.updateOne(
      { username: req.session.username },
      { avatarPath: avatarPath }
    );

    req.session.avatarPath = avatarPath;
    req.session.successMessage = "Avatar updated successfully!";
  } catch (error) {
    console.error("Avatar update error:", error);
    req.session.errorMessage = "Error updating avatar.";
  }

  res.redirect("/profile");
});

app.post("/profile/avatar/delete", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const user = await User.findOne({ username: req.session.username });

    if (user && user.avatarPath) {
      const filePath = path.join(__dirname, "public", user.avatarPath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error("Error deleting avatar file:", error);
      }

      await User.updateOne(
        { username: req.session.username },
        { avatarPath: null }
      );

      req.session.avatarPath = null;
      req.session.successMessage = "Avatar deleted successfully!";
    }
  } catch (error) {
    console.error("Avatar delete error:", error);
    req.session.errorMessage = "Error deleting avatar.";
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

// Posts Feed - Display all posts sorted by newest first
app.get("/posts", async (req, res) => {
  if (req.session.username) {
    try {
      // Fetch all posts from MongoDB, sorted by creation date (newest first)
      const posts = await Feed.find().sort({ createdAt: -1 });
      res.render("posts", {
        posts,
        username: req.session.username,
        categories,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

// Post Submit - Create a new post
app.post("/posts", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const content = req.body.content?.trim();

  if (content) {
    try {
      // Create new post in MongoDB with author and content
      await Feed.create({
        username: req.session.username, // Note: Schema says 'author', let's check
        author: req.session.username,
        content,
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  res.redirect("/posts");
});

// Comments - Add comment to a specific post
app.post("/posts/:uuid/comments", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const { uuid } = req.params;
  const content = req.body.content?.trim();

  if (content) {
    try {
      // Push new comment to post's comments array
      await Feed.updateOne(
        { uuid: uuid },
        {
          $push: {
            comments: {
              content,
              author: req.session.username,
            },
          },
        }
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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

// Write Page - Create post from dedicated write page
app.post("/write", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const content = req.body.content?.trim();

  if (content) {
    try {
      // Create post in MongoDB
      await Feed.create({
        author: req.session.username,
        content,
      });
    } catch (error) {
      console.error("Error creating post from write:", error);
    }
  }
  res.redirect("/posts");
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

// Sample feed creation removed

// =============================== SERVIDOR ===============================
app.listen(4000, "0.0.0.0", () => {
  console.log("Running at: http://localhost:4000");
});
