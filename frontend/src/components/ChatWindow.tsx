import { useState } from "react";

interface Message {
  message: string;
  username: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { message: "Hello!", username: "Alice" },
    { message: "How are you?", username: "Bob" },
  ]);

  // Example of how to render messages
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          {msg.message}
        </div>
      ))}
    </div>
  );
}
