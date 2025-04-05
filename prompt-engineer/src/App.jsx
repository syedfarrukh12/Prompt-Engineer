import { useState } from "react";
import "./App.css";

function App() {
  // State for input fields
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [complexity, setComplexity] = useState("intermediate");
  const [purpose, setPurpose] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [contentType, setContentType] = useState("text");
  const [mediaStyle, setMediaStyle] = useState("realistic");

  // State for the generated prompt and loading status
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Get API key from environment variables
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API key is not configured in environment variables");
      }

      // Construct the system prompt to generate an optimized prompt
      const systemPrompt = `
        You are an expert prompt engineer. Based on the following information, create
        an optimized prompt for Gemini AI that will produce the best possible results:
        
        Topic: ${topic}
        Target Audience: ${audience}
        Complexity Level: ${complexity}
        Purpose: ${purpose}
        Additional Context: ${additionalContext}
        Tone: ${tone}
        Content Type: ${contentType}
        Media Style: ${mediaStyle}
        
        Format the prompt in a clear, concise manner that will produce the most effective response.
        And please try to include only the generated prompt without any additional text.
        The generated prompt should be in a details.
      `;

      // Make direct API call to Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      setGeneratedPrompt(generatedText);
    } catch (err) {
      console.error("Error generating prompt:", err);
      if (err.message.includes("API key")) {
        setError(
          "Gemini API key is not configured. Please check your environment setup."
        );
      } else {
        setError(`Failed to generate prompt: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copying the prompt to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert("Prompt copied to clipboard!");
  };

  return (
    <div className="app-container">
      <header>
        <h1>AI Prompt Engineer</h1>
        <p>Get optimized prompts for better AI responses</p>
      </header>

      <main>
        <section className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                id="topic"
                placeholder="What's your topic?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="audience">Target Audience</label>
              <input
                type="text"
                id="audience"
                placeholder="Who is your audience?"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="complexity">Complexity Level</label>
              <select
                id="complexity"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <input
                type="text"
                id="purpose"
                placeholder="What's the purpose of this content?"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="humorous">Humorous</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="additionalContext">Additional Context</label>
              <textarea
                id="additionalContext"
                placeholder="Add any additional context or specific requirements"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contentType">Content Type</label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {(contentType === "image" || contentType === "video") && (
              <div className="form-group">
                <label htmlFor="mediaStyle">
                  {contentType === "image" ? "Image" : "Video"} Style
                </label>
                <select
                  id="mediaStyle"
                  value={mediaStyle}
                  onChange={(e) => setMediaStyle(e.target.value)}
                >
                  <option value="realistic">Realistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="abstract">Abstract</option>
                  <option value="minimalistic">Minimalistic</option>
                  <option value="3d-render">3D Render</option>
                  <option value="artistic">Artistic</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="generate-button"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Optimized Prompt"}
            </button>

            {error && <div className="error-message">{error}</div>}
          </form>
        </section>

        {generatedPrompt && (
          <section className="result-section">
            <h2>Generated Prompt</h2>
            <div className="prompt-container">
              <pre>
                <b>{generatedPrompt}</b>
              </pre>
              <button onClick={handleCopy} className="copy-button">
                Copy to Clipboard
              </button>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} Prompt Engineer - Get better results from
          AI
        </p>
      </footer>
    </div>
  );
}

export default App;
