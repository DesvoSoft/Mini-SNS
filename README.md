# 🎮 Mini SNS

A lightweight social platform designed for sharing quick text posts. This project was structurally and conceptually built under the guidance of **Professor DongYeop Hwang**.

![Esil Radiru And Frieren]([https://i.pinimg.com/736x/e7/36/28/e736286863b87dd4804086c09fcfc922.jpg](https://lh3.googleusercontent.com/gg-dl/ABS2GSljHdc3pMp68LJunO11a2PrLqKNYJwtc1uND_LFXbiID4sxcv-dPm3VjLrM3f4OEIivmLylZRfdPpLAXfoE2jTxex0JxgbM-QjvDXymTF-7wRmTnT2oMtf_YGO_RbyK1w4KBEoTtNHwVgo9tKjGGnpc8HLKpTmq3x8nC-H7GrVtpQhF=s1024-rj))

## Features

  * **Modular EJS Templating:** Uses modular components (Header, Footer) for scalable view development.
  * **Persistent Layout:** Fixed header and footer elements ensure consistent navigation during scrolling.
  * **Session-Based Authentication:** Basic user login/logout system with access control for private routes.
  * **Modern Frontend:** Fully styled using **Tailwind CSS**

-----

## Acknowledgment and Guidance

This project was developed with the foundational support, architectural insights, and academic guidance provided by **Professor DongYeop Hwang** (GitHub: [`bc8c`](https://github.com/bc8c)).

-----

## Tech Stack & Requirements

| Component | Description |
| :--- | :--- |
| **Backend** | Node.js / Express |
| **Templating** | EJS (Embedded JavaScript Templating) |
| **Styling** | Tailwind CSS (v3.x CDN) + Custom CSS |
| **Auth & State**| `express-session` and `cookie-parser` |

## Installation and Execution

### 1\. Requirements

  * Node.js (LTS recommended)
  * npm

### 2\. Configuration

Open your terminal in the project folder:

```bash
# 1. Install dependencies
npm install
```

### 3\. Start the Server

Execute the Express server:

```bash
node app.js
```

### 4\. Mock Credentials

The system uses hardcoded mock authentication for testing:

| Username | Password |
| :--- | :--- |
| Desvo | 123 |
| Tom | 123456 |

-----

## Roadmap & Future Goals

  * [ ] Implement **image upload** functionality using Multer.
  * [ ] Integrate a database (MongoDB)
  * [ ] Enhance the user profile (`/profile`) view.
  * [ ] Implement basic comment functionality in `feed.ejs`.
