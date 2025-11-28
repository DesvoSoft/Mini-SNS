# Mini SNS

> A lightweight, modern social networking platform built with Node.js, Express, and EJS templating.

<div align="center">
  <img src="https://i.pinimg.com/736x/ff/d6/8a/ffd68a8dcfe161385f57e1d39a9ea94b.jpg" 
       alt="Frieren" 
       width="600" 
       style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 210, 255, 0.3); margin: 20px 0;" />
</div>

[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Acknowledgments](#acknowledgments)

---

## Features

### Core Functionality

- **Session-Based Authentication** - Secure login/logout system with MongoDB user storage
- **Post Creation & Feed** - Share and view posts with MongoDB persistence
- **User Profiles** - Personalized pages with avatar support stored in database
- **Comments System** - Full comment functionality with database storage
- **Category Tags** - Organize content with interactive category chips
- **Bilingual Docs** - Built-in English and Spanish documentation

### Design & Architecture

- **Modern UI/UX** - Beautiful glassmorphism design with animated gradients
- **Responsive Layout** - Mobile-first design that works on all devices
- **Modular Components** - Reusable EJS components for scalable development
- **Hybrid Styling** - Combines Tailwind CSS utilities with custom CSS for maximum flexibility
- **In-App Documentation** - Access comprehensive docs without leaving the app

### Data Management

- **MongoDB Integration** - Full NoSQL database with Mongoose ODM
- **User Authentication** - Session-based login with MongoDB user storage
- **File Uploads** - Profile picture management with Multer (up to 2MB)
- **Auto-Seeding** - Automatic database population from `users.json` on first run
- **Embedded Comments** - Comments stored as subdocuments for atomic updates

---

## Architecture

Mini SNS follows a traditional **MVC-like architecture** with server-side rendering:

### System Components

```
User Browser <---> Express Server <---> MongoDB
                        │
                        └---> File System (Avatars)
```

- **Models** (`models/`) - Mongoose schemas for Users and Feed
- **Views** (`views/`) - EJS templates for server-side rendering
- **Controllers** (`app.js`) - Route handlers and business logic

### Database Design

**Collections**:

- `users` - User accounts (username, password, avatarPath, redirect)
- `feed` - Posts with embedded comments (uuid, content, author, comments[])

**Key Design Decisions**:

- **Embedded Comments**: Stored as subdocuments within posts for simplicity
- **Avatar Storage**: File paths in DB, actual files in `public/uploads/avatars/`
- **Session State**: In-memory sessions (resets on server restart)

_For detailed architecture info, see [ARCHITECTURE.md](docs/ARCHITECTURE.md)_

---

## Tech Stack

### Backend

| Technology          | Version | Purpose                   |
| :------------------ | :------ | :------------------------ |
| **Node.js**         | LTS     | JavaScript runtime        |
| **Express**         | 5.1.0   | Web application framework |
| **EJS**             | 3.1.10  | Server-side templating    |
| **MongoDB**         | 6.0+    | NoSQL database            |
| **Mongoose**        | 9.0.0   | MongoDB ODM               |
| **express-session** | 1.18.2  | Session management        |
| **cookie-parser**   | 1.4.7   | Cookie parsing middleware |
| **morgan**          | 1.10.1  | HTTP request logger       |
| **multer**          | 2.0.2   | File upload handling      |
| **uuid**            | 13.0.0  | Unique ID generation      |

### Frontend

| Technology             | Version      | Purpose                     |
| :--------------------- | :----------- | :-------------------------- |
| **Tailwind CSS**       | 3.x (CDN)    | Utility-first CSS framework |
| **Custom CSS**         | -            | Glassmorphism & animations  |
| **Vanilla JavaScript** | ES6+         | Client-side interactivity   |
| **Quantico Font**      | Google Fonts | Typography                  |

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended) - [Download here](https://nodejs.org/)
- **MongoDB** (6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mini-sns
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MongoDB**

   Make sure MongoDB is running on your system:

   **Windows:**

   ```bash
   mongod
   ```

   **macOS/Linux:**

   ```bash
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   Or directly:

   ```bash
   node app.js
   ```

   The application will:

   - Connect to MongoDB at `mongodb://localhost:27017/mydb`
   - Auto-seed users from `data/users.json` if the database is empty

5. **Open your browser**

   Navigate to: `http://localhost:4000`

### Test Credentials

Use these mock credentials to explore the platform:

| Username  | Password |
| :-------- | :------- |
| **Desvo** | 123      |
| **Tom**   | 1234     |

---

## Project Structure

```
mini-sns/
├── app.js                  # Main application entry point
├── package.json            # Project dependencies and scripts
├── data/                   # Initial user data (for seeding)
│   └── users.json         # User credentials and profiles
├── models/                # MongoDB schemas
│   ├── user.js            # User model (auth, avatars)
│   └── feed.js            # Post and comment model
├── public/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── bg.css         # Background animations
│   │   ├── global.css     # Global styles
│   │   ├── posts.css      # Post-specific styles
│   │   └── write.css      # Form styles
│   ├── js/                # Client-side scripts
│   └── uploads/           # User-uploaded files (avatars)
├── views/                 # EJS templates
│   ├── components/        # Reusable components
│   │   ├── _header.ejs    # Navigation header
│   │   ├── _footer.ejs    # Page footer
│   │   ├── _ui-helpers.ejs # Global CSS helpers
│   │   ├── _gfont.ejs     # Font loader
│   │   └── _categories.ejs # Category chips
│   ├── index.ejs          # Home/login page
│   ├── posts.ejs          # Post feed page
│   ├── write.ejs          # Post creation page
│   ├── profile.ejs        # User profile page
│   ├── profile-avatar.ejs # Avatar upload page
│   ├── feed.ejs           # Post card component
│   └── docs.ejs           # Documentation viewer
├── docs/                  # English documentation
│   ├── ARCHITECTURE.md    # Database and system design
│   ├── COMPONENTS.md      # Component reference
│   └── CONTRIBUTING.md    # Contribution guidelines
└── docs_es/               # Spanish documentation
    ├── ARCHITECTURE.md
    ├── COMPONENTS.md
    └── CONTRIBUTING.md
```

---

## Design System

Mini SNS uses a **Hybrid Styling Approach** combining four distinct patterns:

### 1. Inline Tailwind Utilities

For layouts and one-off elements:

```html
<div class="flex items-center space-x-4"></div>
```

### 2. Global Helper Classes

Defined in `_ui-helpers.ejs` for consistency:

- **Layout**: `.page-shell`, `.content-card`, `.page-title`
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-success`
- **Forms**: `.input-field`, `.input-label`, `.textarea-primary`

### 3. Component Classes (@apply)

Using Tailwind's `@apply` directive for complex components:

```css
.category-pill {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/60;
}
```

### 4. External Stylesheets

Animations and legacy styles in `public/css/`:

- `bg.css` - Animated gradient backgrounds
- `posts.css` - Post card styling
- `global.css` - Base HTML element styles
- `write.css` - Form-specific styles

### Color Palette

- **Cyan**: `#00d2ff` - Links and highlights
- **Lime**: `#c1eb74` - Brand and success states
- **Dark**: `#0d1117` - Base background

---

## Documentation

Mini SNS includes comprehensive built-in documentation accessible at `/docs`:

### Available Docs

- **[Architecture & Database](docs/ARCHITECTURE.md)** - MongoDB schema design and data flow
- **[Components & Design System](docs/COMPONENTS.md)** - Complete component API and styling reference
- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute to the project

### Languages

All documentation is available in:

- English (`/docs`)
- Spanish (`/docs_es`)

Access documentation directly in the app by navigating to `http://localhost:4000/docs`

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/CONTRIBUTING.md) for details on:

- Code style and conventions
- Component creation patterns
- Pull request process
- Issue reporting

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Roadmap

### ✅ Completed Features

- [x] **Session-Based Authentication** - Secure login/logout with MongoDB
- [x] **MongoDB Integration** - Full database persistence with Mongoose
- [x] **Post Creation & Feed** - Create and view posts sorted by newest first
- [x] **User Profiles** - Personalized pages showing user-specific posts
- [x] **Profile Avatars** - Image upload/delete with file validation (2MB max)
- [x] **Comments System** - Full comment functionality with server-side rendering
- [x] **Category Tags** - Interactive category chips
- [x] **Bilingual Documentation** - English + Spanish docs
- [x] **In-App Documentation Viewer** - `/docs` page with markdown rendering
- [x] **Auto-Seeding** - Database population from `users.json`
- [x] **Glassmorphism UI** - Modern design with animated gradients

### 🚀 Planned Features

#### High Priority

- [ ] **Password Hashing** - Replace plain text with bcrypt
- [ ] **CSRF Protection** - Add `csurf` middleware
- [ ] **Rate Limiting** - Prevent brute force attacks
- [ ] **Helmet Security** - Secure HTTP headers

#### Medium Priority

- [ ] **Enhanced Profiles** - Bio editing, social links, follower counts
- [ ] **Search Functionality** - Find posts and users
- [ ] **Post Images** - Upload images with posts (not just avatars)
- [ ] **Like System** - Like/unlike posts and comments
- [ ] **Pagination** - Better performance for large feeds

#### Low Priority

- [ ] **Real-Time Updates** - WebSocket integration for live feeds
- [ ] **Dark/Light Themes** - User-selectable color schemes
- [ ] **Email Notifications** - Alert system for interactions
- [ ] **RESTful API** - JSON endpoints for mobile apps
- [ ] **User Registration** - Public sign-up system

---

### Academic Guidance

This project was developed with the foundational support, architectural insights, and academic guidance provided by:

**Professor DongYeop Hwang**  
GitHub: [`@bc8c`](https://github.com/bc8c)

---

<div align="center">

Made with ❤️ by Desvo

_감사합니다 Profesor Hwang - Dana - K-Lab_

</div>
