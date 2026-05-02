import { useAgentChat } from "@cloudflare/ai-chat/react";
import { useAgent } from "agents/react";
import { createRoot } from "react-dom/client";

function Chat() {
  const agent = useAgent({ agent: "MyAgent" });
  const { messages, sendMessage, status } = useAgentChat({ agent });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Think Agent</h1>
      <p style={{ color: "#555" }}>
        Minimal Cloudflare Think example with Workers AI and the built-in
        workspace tools.
      </p>

      <div style={{ minHeight: 240, marginBottom: 16 }}>
        {messages.map((message) => (
          <div key={message.id} style={{ margin: "12px 0" }}>
            <strong>{message.role}:</strong>{" "}
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const input = event.currentTarget.elements.namedItem(
            "input"
          ) as HTMLInputElement;

          if (!input.value.trim()) {
            return;
          }

          sendMessage({ text: input.value });
          input.value = "";
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          name="input"
          placeholder="Send a message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" disabled={status === "streaming"}>
          Send
        </button>
      </form>

      <p style={{ fontSize: 12, color: "#666" }}>Status: {status}</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Chat />);