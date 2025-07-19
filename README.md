# Gemini AI Chatbox

Welcome to the Gemini AI Chatbox! This is a simple, single-page, serverless web application that allows you to chat with Google's Gemini AI. It's built entirely within a single `index.html` file using vanilla HTML, CSS (via Tailwind CSS CDN), and JavaScript, making it a great project for learning about web development and API integration without requiring any build steps.

## Features

*   **All-in-One `index.html`:** The entire application is self-contained in a single file for maximum portability.
*   **Direct Google Gemini API Integration:** Chat directly with the Gemini AI from the client-side.
*   **Persistent Chat History:** Your conversations are saved in your browser's IndexedDB, so you can pick up where you left off.
*   **Easy API Key Setup:** A settings modal makes it simple to add and manage your Gemini API keys.
*   **API Key Fallback:** If you provide multiple API keys, the app will automatically try the next one if a request fails.
*   **Markdown Support:** The chat displays responses in Markdown, with code blocks and syntax highlighting.
*   **Responsive Design:** The chatbox looks great on both desktop and mobile devices thanks to Tailwind CSS.

## How to Use

Since this is a simple project with no server-side components or build process, you can run it directly in your web browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yapweijun1996/Gemini-GenAI-Chatbox.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Gemini-GenAI-Chatbox
    ```
3.  **Open `index.html` in your browser:**
    You can do this by double-clicking the file or by right-clicking and selecting "Open with" your preferred browser.

## Getting a Gemini API Key

To use this chatbox, you'll need a Google Gemini API key.

1.  Visit the [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on **"Get API key"** to create a new API key.
4.  Copy the key.
5.  In the chatbox, click the settings icon and paste your API key into the input field. You can add multiple keys, and the application will automatically rotate them if one fails.

## Code Overview

The entire application is contained within the `index.html` file. Here's a breakdown of the code:

### HTML

The HTML section defines the structure of the chatbox, including:
*   The header with the title and control buttons.
*   The main chat log area where messages are displayed.
*   The footer with the message input form.
*   The settings modal for configuring API keys and models.

### CSS

The CSS is written using Tailwind CSS classes directly in the HTML, loaded from a CDN. A small `<style>` block is included for custom styles like the scrollbar and Markdown formatting. This approach is great for rapid prototyping and keeping everything in one file.

### JavaScript

The JavaScript code is located inside a `<script type="module">` tag at the end of the `<body>`. It handles all the application's logic. Here are some of the key parts:

*   **DOM Elements:** Variables are defined to get references to the important HTML elements.
*   **State Management:** Variables like `apiKeys`, `currentKeyIndex`, and `isLoading` keep track of the application's state.
*   **IndexedDB:** The application uses IndexedDB to store chat messages and settings. Helper functions `openDb`, `dbGet`, `dbPut`, `dbClear`, etc., handle all database operations.
*   **Event Listeners:** Event listeners are set up for form submissions, button clicks, and input events to make the application interactive.
*   **Core Logic:** The `handleSendMessage` and `sendMessageWithFallback` functions are the heart of the application, handling the process of sending a user's message to the Gemini API and displaying the response, with a mechanism to rotate keys on failure.

## Demo

https://yapweijun1996.github.io/Gemini-GenAI-Chatbox/

## Preview

<img width="1440" height="798" alt="Screenshot 2025-07-19 at 10 39 30 PM" src="https://github.com/user-attachments/assets/5b6a12e7-0bdf-4ff0-8877-7a0531ca2e75" />
