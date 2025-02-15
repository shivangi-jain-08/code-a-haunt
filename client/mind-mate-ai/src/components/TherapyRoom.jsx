import { useRef } from "react";
import { useChat } from "../hooks/useChat";

export const TherapyRoom = () => {
  const inputRef = useRef();
 

  
  const handleSend = async () => {
    const text = inputRef.current.value.trim();
    if (!text || loading) return;
    
    chat(text);
    inputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-between p-4 pointer-events-none">
      <div className="self-start bg-white bg-opacity-50 backdrop-blur-md p-4 rounded-lg">
        <h1 className="text-xl font-bold">MindMate AI</h1>
        <p>Your empathetic mental health companion</p>
      </div>

      <div className="flex flex-col items-end gap-4">
        <button
          onClick={() => setCameraZoomed(!cameraZoomed)}
          className="p-3 bg-green-500 rounded-lg pointer-events-auto"
        >
          {cameraZoomed ? "🔍 Zoom Out" : "🔎 Zoom In"}
        </button>
      </div>

      <div className="flex gap-2 max-w-screen-sm mx-auto w-full pointer-events-auto">
        <input
          ref={inputRef}
          className="flex-1 p-3 rounded-lg bg-white bg-opacity-50 backdrop-blur-md"
          placeholder="Share your thoughts..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading || message}
          className="px-6 py-3 bg-green-500 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};