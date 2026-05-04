 ![Clave App Banner](https://res.cloudinary.com/dwcwp9ebv/image/upload/clave-repo_wsrmkq.jpg)

# ![Batman](https://cdn-icons-png.flaticon.com/32/15468/15468240.png) Clave App - Your Personal AI Sanctuary

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-v4.18-blue?style=flat-square&logo=express)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-orange?style=flat-square)
![Maintained](https://img.shields.io/badge/Maintained-Yes-success?style=flat-square)

## ![](https://cdn-icons-png.flaticon.com/32/2339/2339864.png) Welcome to Clave App

Welcome to **Clave App** - a sophisticated, privacy-focused AI interface designed for developers and enthusiasts who want a clean, powerful environment to interact with various AI models without the clutter.

Built with extensibility and customization in mind, Clave App serves as your personal "Clave" where you can think, create, and explore ideas with AI assistance. Whether you're looking to deploy your own private chat interface, build a custom AI tool, or learn how to integrate multiple AI models into a Node.js application, Clave App provides the perfect foundation.

## ![](https://cdn-icons-png.flaticon.com/32/8589/8589419.png) Key Features

*   **Multi-Model Support:** Seamless integration with GPT-4o, GPT-3.5, and other leading AI models
*   **Advanced Image Generation:** Create stunning visuals with DeepImg and Flux models
*   **Elegant UI/UX:** Distraction-free, dark-mode interface built with EJS and Tailwind CSS
*   **Comprehensive API:** Fully documented RESTful API with robust validation, error handling, and security features
*   **Developer-Centric:** Designed for easy forking, customization, and deployment
*   **Extensible Architecture:** Modular codebase that simplifies adding new features and models

## ![](https://cdn-icons-png.flaticon.com/32/7364/7364295.png) Technology Stack

*   **Runtime Environment:** [Node.js](https://nodejs.org/) (v18 or higher)
*   **Web Framework:** [Express.js](https://expressjs.com/)
*   **Template Engine:** [EJS](https://ejs.co/)
*   **Styling Framework:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icon Library:** [Lucide Icons](https://lucide.dev/)
*   **Syntax Highlighting:** [Highlight.js](https://highlightjs.org/)

## ![](https://cdn-icons-png.flaticon.com/32/675/675579.png) Quick Start Guide

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn package manager
*   API keys for desired AI services

### Installation & Setup

1.  **Fork & Clone Repository**
    Begin by forking this repository to your GitHub account, then clone it locally:
    ```bash
    git clone https://github.com/1dev-hridoy/Clave-App.git
    cd Clave-App
    ```

2.  **Install Dependencies**
    Install all required packages using npm:
    ```bash
    npm install
    ```

3.  **Launch Application**
    Start the development server:
    ```bash
    npm start
    ```
    Access the application at `http://localhost:3000` and begin exploring your AI sanctuary.

## ![](https://cdn-icons-png.flaticon.com/32/3815/3815573.png) Customization Options

Clave App is built for flexibility and personalization:

*   **Branding & Identity:** Modify `config/webConfig.json` to customize site name, description, icons, and theme colors
*   **AI Model Integration:** Manage model configurations in `config/models.js` to add or remove AI services
*   **UI/UX Styling:** Leverage Tailwind CSS for comprehensive styling adjustments in `public/css` with view templates in `views/`
*   **API Extensions:** Extend functionality by adding new controllers in `controllers/` and routes in `routes/`

## ![](https://cdn-icons-png.flaticon.com/32/8297/8297437.png) API Documentation

Comprehensive API documentation is available within the application. Once your server is running, visit `/docs` (e.g., `http://localhost:3000/docs`) for an interactive API reference.

### Core Endpoints

*   `POST /api/chat` - Advanced chat completions with conversation history
*   `POST /api/image` - High-quality image generation with style options
*   `POST /api/reset` - Secure conversation history clearing
*   `GET /api/status` - System health and status monitoring

## ![](https://cdn-icons-png.flaticon.com/32/17379/17379046.png) Code Examples

Here's how to interact with the API using common languages:

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-session-id': 'my-session-123'
  },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    model: 'gpt-3.5'
  })
});

const data = await response.json();
console.log(data.text);
```

### Python (Requests)

```python
import requests

url = "http://localhost:3000/api/chat"
headers = {
    "Content-Type": "application/json",
    "x-session-id": "my-session-123"
}
data = {
    "message": "Tell me a joke",
    "model": "gpt-4o"
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["text"])
```

## ![](https://cdn-icons-png.flaticon.com/32/17942/17942509.png) Development Roadmap

Current and planned enhancements for Clave App:

- [x] **Phase 1:** Basic Chat Interface Implementation
- [x] **Phase 2:** Image Generation Capabilities
- [x] **Phase 3:** Comprehensive API Documentation
- [x] **Phase 4:** Robust Global Error Handling
- [x] **Phase 5:** Input Validation & Security Headers
- [ ] **Phase 6:** Response Streaming
- [ ] **Phase 7:** Markdown Rendering Improvements
- [ ] **Phase 8:** Dark/Light Mode Toggle

## ![](https://cdn-icons-png.flaticon.com/32/10703/10703030.png) Security Features

We take security seriously. Clave App comes with built-in protection:

*   **Input Validation:** Comprehensive validation middleware for all API endpoints.
*   **XSS Protection:** Automatic sanitization of user inputs.
*   **Secure Logging:** Sensitive data (API keys, passwords) is automatically redacted from logs.
*   **Error Handling:** Production-safe error responses that don't leak stack traces.
*   **Headers:** Security headers configured for best practices.

## ![](https://cdn-icons-png.flaticon.com/32/3735/3735057.png) Project Structure

```
Clave-App/
├── config/             # Configuration files (models, web settings)
├── controllers/        # Request handlers (chat, image, utility)
├── lib/                # AI model implementations
├── middleware/         # Express middleware (logger, error, validator)
├── public/             # Static assets (css, js, images)
├── routes/             # API and view routes
├── views/              # EJS templates
└── server.js           # Application entry point
```

## ![](https://cdn-icons-png.flaticon.com/32/8765/8765344.png) Community & Contributions

We welcome contributions from the developer community. To contribute:

1.  **Fork** the repository
2.  Create a feature branch (`git checkout -b feature/amazing-enhancement`)
3.  Commit your changes (`git commit -m 'Add amazing enhancement'`)
4.  Push to your branch (`git push origin feature/amazing-enhancement`)
5.  Open a **Pull Request** with a detailed description

Please review our [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

See [CHANGELOG.md](CHANGELOG.md) for details on releases and changes.

## ![](https://cdn-icons-png.flaticon.com/32/1828/1828884.png) Support the Project

If Clave App has benefited your workflow or inspired your projects, please consider showing your support:

*   ⭐ Star this repository on GitHub
*   🐦 Follow the maintainer on Twitter [@1dev_hridoy](https://twitter.com/1dev_hridoy)
*   💬 Share your experience with others in the developer community

## ![](https://cdn-icons-png.flaticon.com/32/3135/3135748.png) License & Legal

This project is distributed under the permissive [MIT License](LICENSE), allowing for commercial use, modification, distribution, and patent use. See the [LICENSE](LICENSE) file for complete terms.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/1dev-hridoy">Hridoy</a> and <a href="https://github.com/1dev-hridoy/Clave-App/graphs/contributors">contributors</a>.</sub>
</div>
