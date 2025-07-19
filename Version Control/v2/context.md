# Project: Gemini AI Chatbox

This is a single-file, serverless chat application built with vanilla HTML, CSS, and JavaScript. The entire application is contained within a single `index.html` file, making it highly portable and easy to run. It allows users to interact with the Google Gemini AI.

## Key Features

*   **All-in-One `index.html`:** The entire application—structure (HTML), styling (Tailwind CSS via CDN and inline styles), and logic (JavaScript)—is contained in a single file.
*   **Direct Gemini API Integration:** The application communicates directly with the Google Gemini API from the client-side.
*   **Persistent Chat History:** Chat history is stored locally in the user's browser using IndexedDB, allowing conversations to be saved between sessions.
*   **Settings Configuration:** A modal allows users to configure their Gemini API key and select the AI model to use.
*   **Markdown Rendering:** The chat log renders Markdown, including syntax highlighting for code blocks.
*   **Responsive Design:** The interface is styled with Tailwind CSS for a modern and responsive layout.

## Technology Stack

*   **HTML:** The structure of the application.
*   **CSS (Tailwind CSS):** For styling the user interface, included via a CDN.
*   **JavaScript (Vanilla):** For all client-side logic, embedded directly within the `index.html` file inside a `<script type="module">` tag.
*   **IndexedDB:** For client-side storage of chat history and settings.
*   **Google Gemini API:** The AI service that powers the chat functionality.
*   **External Libraries (via CDN):**
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [marked.js](https://marked.js.org/) for Markdown parsing.
    *   [highlight.js](https://highlightjs.org/) for syntax highlighting.
    *   [ua-parser-js](https://github.com/faisalman/ua-parser-js) for user-agent parsing.

## Project Structure

The entire application is self-contained in `index.html`. There are no external CSS or JavaScript files. This design choice emphasizes simplicity and portability.
