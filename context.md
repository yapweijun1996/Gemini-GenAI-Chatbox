# Project: Gemini AI Chatbox

This is a sophisticated chat application built within a **Vite development environment** that produces a **single-file `index.html` for production**. It uses vanilla HTML, CSS, and JavaScript to interact with the Google Gemini AI, augmented by a powerful multi-agent memory system and Google Search integration.

## Key Features

*   **Vite Development Environment:** Developed using Vite for a fast, modern development experience with features like Hot Module Replacement (HMR).
*   **Single-File Production Build:** Uses `vite-plugin-singlefile` to bundle the entire application into one `index.html` file for ultimate portability.
*   **RAG Memory System:** Implements a Retrieval-Augmented Generation (RAG) architecture with three specialized AI agents for long-term memory management:
    *   **Extraction Agent (`Ut`):** Extracts key facts from conversations to form new memories.
    *   **Retrieval Agent (`Pt`):** Searches the memory database to find the most relevant facts related to the current user query, providing context to the main AI.
    *   **Consolidation Agent (`V_t`):** Periodically and manually refines, de-duplicates, and merges memories to maintain accuracy and efficiency.
*   **Google Search Integration:** The AI can use Google Search as a tool to answer questions about recent events or to find information outside of its training data, providing source links for its claims.
*   **Persistent Storage:** Chat history and the AI's memories are stored locally in the user's browser using **IndexedDB**.
*   **Manual Memory Management:**
    *   **Optimize Memory:** A button in the settings allows the user to manually trigger the Consolidation Agent.
    *   **Import/Export:** Users can export the AI's memory to a JSON file for backup and import it back into the application.
*   **Advanced UI/UX:**
    *   **Markdown Rendering:** The chat log renders Markdown with syntax highlighting.
    *   **Image Uploads:** Supports vision-enabled models by allowing users to upload images.
    *   **Loading Indicators:** Provides visual feedback (e.g., spinners) for asynchronous operations like memory optimization.
    *   **Responsive Design:** Styled with Tailwind CSS for a modern and responsive layout.

## Technology Stack

*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Bundling Plugin:** [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
*   **HTML:** The application's structure.
*   **CSS (Tailwind CSS):** For styling the user interface.
*   **JavaScript (Vanilla):** For all client-side logic.
*   **Client-Side Database:** IndexedDB for storing chat history and AI memories.
*   **AI Service:** Google Gemini API with the Google Search tool enabled.
*   **External Libraries:**
    *   [marked.js](https://marked.js.org/) for Markdown parsing.
    *   [highlight.js](https://highlightjs.org/) for syntax highlighting.
    *   [ua-parser-js](https://github.com/faisalman/ua-parser-js) for user-agent parsing.

## Project Structure

*   **`index.html`:** The main entry point of the application.
*   **`src/main.js`:** Contains all the JavaScript logic, including the AI agents, API calls, and UI interactions.
*   **`src/style.css`:** Contains the Tailwind CSS directives and any custom styles.
*   **`vite.config.js`:** Configuration file for Vite and its plugins.
*   **`dist/index.html`:** The final, bundled single-file output after running the build command.
