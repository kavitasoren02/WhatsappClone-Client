import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import type { Chat, Message } from "./types"
import './App.css'

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(BACKEND_URI || "http://localhost:5000")
    setSocket(newSocket)

    // Fetch initial chats
    fetchChats()

    // Listen for new messages
    newSocket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message])
      fetchChats() // Refresh chat list to update last message
    })

    // Listen for message status updates
    newSocket.on("messageStatusUpdate", (updatedMessage: Message) => {
      setMessages((prev) => prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg)))
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/api/chats`)
      const data = await response.json()
      setChats(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching chats:", error)
      setLoading(false)
    }
  }

  const fetchMessages = async (waId: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/messages/${waId}`,
      )
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat)
    fetchMessages(chat.wa_id)
  }

  const sendMessage = async (text: string) => {
    if (!selectedChat || !text.trim()) return

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/messages/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wa_id: selectedChat.wa_id,
            text: text.trim(),
            type: "text",
          }),
        },
      )

      if (response.ok) {
        const newMessage = await response.json()
        socket?.emit("sendMessage", newMessage)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200">
        <ChatList chats={chats} selectedChat={selectedChat} onChatSelect={handleChatSelect} />
      </div>

      {/* Chat Window */}
      <div className="hidden md:flex md:w-2/3 flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} messages={messages} onSendMessage={sendMessage} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8 opacity-20">
                <svg viewBox="0 0 303 172" className="w-full h-full">
                  <path
                    fill="#DDD"
                    d="M229.2 62.8c-2.2-2.2-5.8-2.2-8 0l-25.5 25.5-25.5-25.5c-2.2-2.2-5.8-2.2-8 0s-2.2 5.8 0 8l25.5 25.5-25.5 25.5c-2.2 2.2-2.2 5.8 0 8 1.1 1.1 2.6 1.7 4 1.7s2.9-.6 4-1.7l25.5-25.5 25.5 25.5c1.1 1.1 2.6 1.7 4 1.7s2.9-.6 4-1.7c2.2-2.2 2.2-5.8 0-8l-25.5-25.5 25.5-25.5c2.2-2.2 2.2-5.8 0-8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-500 mb-2">WhatsApp Web</h2>
              <p className="text-gray-400">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat Window Overlay */}
      {selectedChat && (
        <div className="md:hidden fixed inset-0 bg-white z-50">
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={sendMessage}
            onBack={() => setSelectedChat(null)}
          />
        </div>
      )}
    </div>
  )
}

export default App
