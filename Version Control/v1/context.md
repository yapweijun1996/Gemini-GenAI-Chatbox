# Project: Gemini AI Chatbox

This is a single-page, serverless chat application built with vanilla HTML, CSS, and JavaScript. It allows users to interact with the Google Gemini AI.

## Key Features

*   **Direct Gemini API Integration:** The application communicates directly with the Google Gemini API from the client-side.
*   **Persistent Chat History:** Chat history is stored locally in the user's browser using IndexedDB, allowing conversations to be saved between sessions.
*   **Settings Configuration:** A modal allows users to configure their Gemini API key and select the AI model to use.
*   **Markdown Rendering:** The chat log renders Markdown, including syntax highlighting for code blocks.
*   **Responsive Design:** The interface is styled with Tailwind CSS for a modern and responsive layout.

## Technology Stack

*   **HTML:** The structure of the application.
*   **CSS (Tailwind CSS):** For styling the user interface.
*   **JavaScript (Vanilla):** For all client-side logic, including API calls, DOM manipulation, and IndexedDB management.
*   **IndexedDB:** For client-side storage of chat history and settings.
*   **Google Gemini API:** The AI service that powers the chat functionality.

## Project Structure

The entire application is currently contained within a single `index.html` file. This includes the HTML structure, CSS styles, and JavaScript logic.

## Potential Improvements (Client-Side)

*   **Code Organization:** Separate HTML, CSS, and JavaScript into their own files (`index.html`, `style.css`, `script.js`) for better maintainability.
*   **JavaScript Modularization:** Break down the JavaScript code into smaller, more focused modules (e.g., for database interactions, UI updates, and API communication) to improve readability and organization.
