# Mini SNS

> A lightweight, modern social networking platform built with Node.js, Express, and EJS templating.

![Frieren](https://i.pinimg.com/736x/ff/d6/8a/ffd68a8dcfe161385f57e1d39a9ea94b.jpg)

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

- **Session-Based Authentication** - Secure login/logout system with protected routes
- **Post Creation & Feed** - Share and view text posts in real-time
- **User Profiles** - Personalized user pages with profile image support
- **Comments System** - Engage with posts through comments
- **Category Tags** - Organize content with interactive category chips
- **Bilingual Docs** - Built-in English and Spanish documentation

### Design & Architecture

- **Modern UI/UX** - Beautiful glassmorphism design with animated gradients
- **Responsive Layout** - Mobile-first design that works on all devices
- **Modular Components** - Reusable EJS components for scalable development
- **Hybrid Styling** - Combines Tailwind CSS utilities with custom CSS for maximum flexibility
- **In-App Documentation** - Access comprehensive docs without leaving the app

---

## Tech Stack

### Backend

| Technology          | Version | Purpose                   |
| :------------------ | :------ | :------------------------ |
| **Node.js**         | LTS     | JavaScript runtime        |
| **Express**         | 5.1.0   | Web application framework |
| **EJS**             | 3.1.10  | Server-side templating    |
| **express-session** | 1.18.2  | Session management        |
| **cookie-parser**   | 1.4.7   | Cookie parsing middleware |
| **morgan**          | 1.10.1  | HTTP request logger       |

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

3. **Start the development server**

   ```bash
   npm start
   ```

   Or directly:

   ```bash
   node app.js
   ```

4. **Open your browser**

   Navigate to: `http://localhost:4000`

### Test Credentials

Use these mock credentials to explore the platform:

| Username  | Password |
| :-------- | :------- |
| **Desvo** | 123      |
| **Tom**   | 123456   |

---

## Project Structure

```
mini-sns/
├── app.js                  # Main application entry point
├── package.json            # Project dependencies and scripts
├── public/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── bg.css         # Background animations
│   │   ├── global.css     # Global styles
│   │   ├── posts.css      # Post-specific styles
│   │   └── write.css      # Form styles
│   ├── js/                # Client-side scripts
│   └── uploads/           # User-uploaded files
├── views/                 # EJS templates
│   ├── components/        # Reusable components
│   │   ├── _header.ejs    # Navigation header
│   │   ├── _footer.ejs    # Page footer
│   │   ├── _ui-helpers.ejs # Global CSS helpers
│   │   ├── _gfont.ejs     # Font loader
│   │   └── _categories.ejs # Category chips
│   ├── index.ejs          # Home/feed page
│   ├── login.ejs          # Login page
│   ├── register.ejs       # Registration page
│   ├── write.ejs          # Post creation page
│   ├── profile.ejs        # User profile page
│   └── docs.ejs           # Documentation viewer
├── docs/                  # English documentation
│   ├── COMPONENTS.md      # Component reference
│   └── CONTRIBUTING.md    # Contribution guidelines
└── docs_es/               # Spanish documentation
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

### In Progress

- [x] Session-based authentication
- [x] Post creation and feed
- [x] User profiles
- [x] Category system
- [x] Bilingual documentation
- [x] Documentation viewer

### Planned Features

- [ ] **Image Uploads** - Using Multer for profile and post images
- [ ] **Database Integration** - Migrate from mock data to MongoDB
- [ ] **Enhanced Profiles** - Bio, social links, follower counts
- [ ] **Comment System** - Full CRUD operations for comments
- [ ] **Search Functionality** - Find posts and users
- [ ] **Real-time Updates** - WebSocket integration for live feeds
- [ ] **Dark/Light Themes** - User-selectable color schemes
- [ ] **Email Notifications** - Alert system for interactions
- [ ] **API Endpoints** - RESTful API for mobile apps

---

## Acknowledgments

### Academic Guidance

This project was developed with the foundational support, architectural insights, and academic guidance provided by:

**Professor DongYeop Hwang**  
GitHub: [`@bc8c`](https://github.com/bc8c)

### Special Thanks

- K-Lab community for testing and feedback
- Contributors who have helped improve this project

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)

---

<div align="center">

**Made with ❤️ by the Mini SNS Team**

_감사합니다 Profesor Hwang - Dana - K-Lab_

</div>
