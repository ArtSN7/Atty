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
import { useEffect } from "react"
import axios from "axios"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"

type Conversation = {
  id: number
  name: string
  avatar: string
  email: string
}

export default function ChatPage() {

  const [conversations, setConversations] = useState<Conversation[]>([])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const [showFindPeople, setShowFindPeople] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [chatMessages, setChatMessages] = useState<{ content: string; sender: string; timestamp: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { email } = useContext(AppContext)

  const refreshConversations = () => {
    axios.get<Conversation[]>(`http://127.0.0.1:5000/conversations?email=${encodeURIComponent(email)}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    })
      .then(response => {
        console.log("Fetched Conversations:", response.data); // Log fetched conversations
        if (response.data.length > 0) {
          console.log("Conversation Structure:", JSON.stringify(response.data[0], null, 2)); // Log structure of first conversation
          setConversations(response.data);
          setSelectedConversation(response.data[0]); // Set the first conversation as selected
          console.log("Selected Conversation:", response.data[0]); // Log selected conversation
        }
      })
      .catch(error => console.error('Error refreshing conversations:', error));
  };

  useEffect(() => {
    refreshConversations();
  }, [email]);

  useEffect(() => {
    const fetchMessages = () => {
      if (selectedConversation) {
        axios.get<{ content: string; sender: string; timestamp: string }[]>(`http://127.0.0.1:5000/messages?email=${encodeURIComponent(email)}&receiver_email=${encodeURIComponent(selectedConversation.email)}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        })
          .then(response => {
            setChatMessages(response.data);
          })
          .catch(error => console.error('Error fetching messages:', error));
      }
    };

    // Fetch messages initially
    fetchMessages();

    // Set up polling interval
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedConversation, email]);

  const handleSendMessage = () => {

    if (newMessage.trim() && selectedConversation) {
      console.log(selectedConversation)
      axios.post('http://127.0.0.1:5000/messages', {
        content: newMessage,
        receiver_email: selectedConversation.email,
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      })
        .then(() => {
          setChatMessages(prevMessages => [...prevMessages, { content: newMessage, sender: 'You', timestamp: new Date().toISOString() }]);
          setNewMessage("");
          refreshConversations(); // Refresh conversations after sending a message
        })
        .catch(error => console.error('Error sending message:', error));
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 bg-zinc-50 border-r shadow-md flex flex-col"
      >
        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-2">
            {conversations.map((conv) => (
              <motion.div
                key={conv.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-2 cursor-pointer rounded-lg ${
                  selectedConversation?.name === conv.name ? "bg-zinc-200" : "hover:bg-zinc-100"
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs mt-1 text-center">{conv.name}</span>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t flex flex-col items-center space-y-2 bg-muted text-muted-foreground">
          <Button onClick={() => setShowFindPeople(true)} variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowEditProfile(true)} variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <Card className="flex-1 flex flex-col m-4 shadow-lg bg-muted text-muted-foreground">
          {/* Minimalistic Header */}
          <div className="flex items-center p-4 border-b">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={selectedConversation?.avatar} />
              <AvatarFallback>{selectedConversation?.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-foreground">{selectedConversation?.name}</h2>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4">
            <ScrollArea className="h-full">
              <AnimatePresence>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 ${msg.sender === email ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-block p-3 rounded-lg ${
                        msg.sender === email ? "bg-black text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                       {msg.content} <em className="text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</em>
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} className="flex w-full space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow"
              />
              <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
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
