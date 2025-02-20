import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Send, UserPlus, Settings } from "lucide-react"
import { FindPeople } from "@/components/FindPeople"
import { EditProfile } from "@/components/EditProfile"
import socket from "../main"; // Adjust the path as needed
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState({
    name: "Alice",
    avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice",
  })
  const [showFindPeople, setShowFindPeople] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const conversations = [
    { name: "Alice", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice" },
    { name: "Bob", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Bob" },
    { name: "Charlie", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Charlie" },
  ]

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    socket.emit("chat_message", message);
  };

  socket.on("chat_response", (data : any) => {
    console.log(data);
  });


  return (
    <div className="flex h-screen bg-background">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 bg-zinc-50 border-r shadow-md flex flex-col"
      >
        <Sidebar />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col flex-grow"
      >
        <ChatWindow />
        <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </motion.div>
      {/* Find People Modal */}
      {showFindPeople && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFindPeople(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <FindPeople />
          </motion.div>
        </motion.div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowEditProfile(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditProfile />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
