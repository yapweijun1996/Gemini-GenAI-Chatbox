# Gemini AI Chatbox

Welcome to the Gemini AI Chatbox! This is a simple, single-page, serverless web application that allows you to chat with Google's Gemini AI. It's built with vanilla HTML, CSS, and JavaScript, and uses Vite for a modern development experience while maintaining a single-file output for production.

## Features

*   **All-in-One `index.html`:** The entire application is self-contained in a single file for maximum portability after the build process.
*   **Direct Google Gemini API Integration:** Chat directly with the Gemini AI from the client-side.
*   **Persistent Chat History:** Your conversations are saved in your browser's IndexedDB, so you can pick up where you left off.
*   **Easy API Key Setup:** A settings modal makes it simple to add and manage your Gemini API keys.
*   **API Key Fallback:** If you provide multiple API keys, the app will automatically try the next one if a request fails.
*   **Markdown Support:** The chat displays responses in Markdown, with code blocks and syntax highlighting.
*   **Responsive Design:** The chatbox looks great on both desktop and mobile devices thanks to Tailwind CSS.

## How to Use

The production-ready version of the application is a single `index.html` file located in the `dist` directory. You can run it directly in your web browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yapweijun1996/Gemini-GenAI-Chatbox.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Gemini-GenAI-Chatbox
    ```
3.  **Open `dist/index.html` in your browser:**
    You can do this by double-clicking the file or by right-clicking and selecting "Open with" your preferred browser.

## Development

This project uses Vite for a modern development workflow.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start a local server, and you can access the application at the URL provided in the terminal. The server supports hot-reloading, so any changes you make to the source files will be reflected in the browser immediately.

## Build

To create the final, single-file `index.html` for production, run the following command:

```bash
npm run build
```

This will generate a `dist` directory containing the optimized, single-file application.

## Getting a Gemini API Key

To use this chatbox, you'll need a Google Gemini API key.

1.  Visit the [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on **"Get API key"** to create a new API key.
4.  Copy the key.
5.  In the chatbox, click the settings icon and paste your API key into the input field. You can add multiple keys, and the application will automatically rotate them if one fails.

## Code Overview

The application source code is located in the `src` directory and is organized into the following files:

*   `index.html`: The main HTML structure of the application.
*   `main.js`: The main entry point for the application's JavaScript logic.
*   `styles.css`: Custom styles for the application.

The Vite build process bundles all the code from these files into a single `index.html` file in the `dist` directory.

## Demo

https://yapweijun1996.github.io/Gemini-GenAI-Chatbox/

## Preview

<img width="1440" height="798" alt="Screenshot 2025-07-19 at 10 39 30 PM" src="https://github.com/user-attachments/assets/5b6a12e7-0bdf-4ff0-8877-7a0531ca2e75" />
