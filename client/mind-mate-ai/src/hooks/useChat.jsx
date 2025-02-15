import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const processMessage = async (text) => {
    try {
      // Generate audio with ElevenLabs
      const audioResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID`,
        {
          method: "POST",
          headers: {
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );
      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Get lipsync data
      const formData = new FormData();
      formData.append("audio", audioBlob);
      const lipsyncResponse = await fetch(`${backendUrl}/lip-sync`, {
        method: "POST",
        body: formData,
      });
      const lipsync = await lipsyncResponse.json();

      return {
        text,
        audio: audioUrl,
        lipsync,
        animation: "Talking",
        facialExpression: "neutral",
      };
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  };

  const chat = async (input) => {
    setLoading(true);
    try {
      // Get AI response from backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const { messages: aiMessages } = await response.json();

      // Process each message
      for (const msg of aiMessages) {
        const processed = await processMessage(msg.text);
        if (processed) {
          setMessages(prev => [...prev, processed]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentMessage(messages[0] || null);
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message: currentMessage,
        loading,
        cameraZoomed,
        setCameraZoomed,
        onMessagePlayed: () => setMessages(prev => prev.slice(1)),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);