# Gemini AI Search Chat Example

This project is a single-file, serverless web application that demonstrates how to build a chat interface powered by the Google Gemini API. It showcases the use of the Google Search tool, allowing the AI to answer questions about recent events and provide up-to-date information.

## Features

- **Direct Gemini API Integration:** Connects to the Google Gemini API using the `@google/genai` library.
- **Google Search Tool:** The AI is configured to use Google Search to find real-time information.
- **Streaming Responses:** Displays the AI's response as it's being generated for a better user experience.
- **Source Citing:** Shows the web sources the AI used to formulate its response.
- **Modern UI:** A clean, responsive chat interface built with Tailwind CSS.
- **Error Handling:** Displays informative error messages if the API key is missing or other issues occur.

## How to Run

1.  **Open the `index.html` file:** Since this is a serverless application, you can simply open the [`index.html`](./index.html) file in your web browser.
2.  **Set Your API Key:** The application requires a Google Gemini API key to function. You must set it in one of the following ways:
    *   **URL Parameter (Recommended for testing):** Append your API key to the URL as a query parameter.
        ```
        file:///path/to/your/project/Example/Gemini%20AI%20Search%20Chat%20Example%20Logic/index.html?api_key=YOUR_API_KEY
        ```
    *   **Environment Variable (for development):** If you are serving this file through a local development server that supports environment variables on the client side (like Vite), you can set the `API_KEY` environment variable.

## Technical Details

- **Frameworks/Libraries:**
    -   **@google/genai:** For interacting with the Gemini API.
    -   **Tailwind CSS:** For styling the user interface.
- **API Model:** Uses the `gemini-1.5-flash` model.
- **Grounding/Attribution:** The application is designed to receive and display `groundingChunks` from the API, which contain the source URLs for the information provided.