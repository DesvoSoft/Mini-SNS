// =============================== IMPORTS ===============================
const express = require("express"); // --- Framework servidor web
const app = express();

const path = require("path"); // --- Manejo de rutas y directorios
const fs = require("fs"); // --- Lectura de archivos locales
const morgan = require("morgan"); // --- Logs HTTP en consola
const cookieParser = require("cookie-parser"); // --- Manejo de cookies
const session = require("express-session"); // --- Manejo de sesiones
const multer = require("multer"); // --- Manejo de subida de archivos
const bcrypt = require("bcrypt"); // --- Hashing de contraseñas

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

const dbURI = "mongodb://localhost:27017/mydb";

const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(dbURI, {
      serverSelectionTimeoutMS: 3000, // Fail after 3 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    .then(async () => {
      console.log("Connected to MongoDB");
      await seedUsers();
    })
    .catch((error) => {
      console.error(
        "Error connecting to MongoDB. Retrying in 5 seconds...",
        error.message
      );
      setTimeout(connectWithRetry, 5000);
    });
};

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to " + dbURI);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

connectWithRetry();

// =============================== MIDDLEWARE HELPER ===============================
function isAuthenticated(req, res, next) {
  if (req.session.username) {
    return next();
  }
  res.redirect("/");
}

// =============================== REGISTRATION ===============================
app.get("/register", (req, res) => {
  if (req.session.username) {
    return res.redirect("/posts");
  }
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      friends: [],
    });

    // Auto-login
    req.session.username = newUser.username;
    req.session.avatarPath = newUser.avatarPath;
    res.redirect("/posts");
  } catch (error) {
    console.error("Registration error:", error);
    res.render("register", { error: "Error creating account" });
  }
});

// =============================== AUTENTICACION ===============================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      req.session.loginError = "Database unavailable. Please try again later.";
      return res.redirect("/");
    }

    const user = await User.findOne({ username });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.username = user.username;
        req.session.avatarPath = user.avatarPath;
        return res.redirect(user.redirect);
      }
    }

    req.session.loginError = "Usuario o contraseña incorrectos.";
    return res.redirect("/");
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

// =============================== FRIENDS ===============================
app.get("/friends/list", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username });
    const friends = await User.find({ username: { $in: user.friends } });

    res.render("friends", {
      username: req.session.username,
      avatarPath: req.session.avatarPath,
      friends: friends,
      searchResults: [],
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.redirect("/posts");
  }
});

app.post("/friends/search", isAuthenticated, async (req, res) => {
  const { searchQuery } = req.body;
  try {
    const currentUser = await User.findOne({ username: req.session.username });
    const friends = await User.find({ username: { $in: currentUser.friends } });

    let searchResults = [];
    if (searchQuery) {
      searchResults = await User.find({
        username: {
          $regex: searchQuery,
          $options: "i",
          $ne: req.session.username, // Exclude self
          $nin: currentUser.friends, // Exclude existing friends
        },
      });
    }

    res.render("friends", {
      username: req.session.username,
      avatarPath: req.session.avatarPath,
      friends: friends,
      searchResults: searchResults,
    });
  } catch (error) {
    console.error("Error searching friends:", error);
    res.redirect("/friends/list");
  }
});

app.post("/friends/add", isAuthenticated, async (req, res) => {
  const { friendUsername } = req.body;
  try {
    const currentUser = await User.findOne({ username: req.session.username });

    if (!currentUser.friends.includes(friendUsername)) {
      await User.updateOne(
        { username: req.session.username },
        { $push: { friends: friendUsername } }
      );
    }

    res.redirect("/friends/list");
  } catch (error) {
    console.error("Error adding friend:", error);
    res.redirect("/friends/list");
  }
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
        avatarPath: req.session.avatarPath,
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
      avatarPath: req.session.avatarPath,
      user: user,
      successMessage: successMessage,
      errorMessage: errorMessage,
    });
  } catch (error) {
    console.error("Avatar page error:", error);
    res.redirect("/profile");
  }
});

app.post(
  "/profile/avatar",
  isAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
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
  }
);

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
    avatarPath: req.session.avatarPath,
    loginError: loginError,
  });
});

// =============================== POSTS ===============================
app.get("/posts", isAuthenticated, async (req, res) => {
  try {
    const posts = await Feed.find().sort({ createdAt: -1 });
    const authors = [...new Set(posts.map((post) => post.author))];

    // Fetch avatar paths for these authors
    const users = await User.find({ username: { $in: authors } });
    const authorAvatars = {};
    users.forEach((user) => {
      authorAvatars[user.username] = user.avatarPath;
    });

    res.render("posts", {
      posts,
      username: req.session.username,
      avatarPath: req.session.avatarPath,
      categories,
      authorAvatars, // Pass the map of avatars to the view
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.redirect("/");
  }
});

// Post Submit - Create a new post
app.post("/posts", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const content = req.body.content?.trim();
  const privacy = req.body.privacy || "public";

  if (content) {
    try {
      // Create new post in MongoDB with author and content
      await Feed.create({
        username: req.session.username, // Note: Schema says 'author', let's check
        author: req.session.username,
        content,
        privacy,
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

// Like Post - Toggle like status
app.post("/posts/:uuid/like", async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { uuid } = req.params;
  const username = req.session.username;

  try {
    const post = await Feed.findOne({ uuid });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(username);
    let liked = false;

    if (likeIndex === -1) {
      // Add like
      post.likes.push(username);
      liked = true;
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
      liked = false;
    }

    await post.save();

    res.json({
      success: true,
      likesCount: post.likes.length,
      liked: liked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Write
app.get("/write", isAuthenticated, (req, res) => {
  res.render("write", {
    username: req.session.username,
    avatarPath: req.session.avatarPath,
    categories,
  });
});

// Write Page - Create post from dedicated write page
app.post("/write", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const content = req.body.content?.trim();
  const privacy = req.body.privacy || "public";

  if (content) {
    try {
      // Create post in MongoDB
      await Feed.create({
        author: req.session.username,
        content,
        privacy,
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
    avatarPath: req.session.avatarPath,
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
