import { Dispatch, SetStateAction } from "react";
import { Send } from "lucide-react";
import socket from "../main"; // Adjust the path as needed

interface MessageInputProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="p-4">
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
        />
        <button type="submit" className="bg-purple-500 hover:bg-purple-600" title="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
