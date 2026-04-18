import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { getApiOrigin } from "../utils/api";

export default function ChatWidget() {
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isOpen && isAuthenticated()) {
      const newSocket = io(getApiOrigin());
      setSocket(newSocket);

      // Join chat with user info
      newSocket.emit("join", {
        id: user.id,
        name: user.name,
      });

      // Listen for chat history
      newSocket.on("chatHistory", (history) => {
        setMessages(history);
      });

      // Listen for new messages
      newSocket.on("chatMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit("chatMessage", {
      senderId: user?.id || null,
      senderName: user?.name || "Guest",
      message: inputMessage.trim(),
    });

    setInputMessage("");
  };

  // Handle chat toggle
  const toggleChat = () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up"
             style={{ height: "450px" }}>
          {/* Header */}
          <div className="bg-navy-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold text-sm">Live Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-sm text-navy-400 mt-8">
                No messages yet. Say hello! 👋
              </p>
            )}
            {messages.map((msg, index) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                >
                  <span className="text-xs text-navy-400 mb-1">
                    {msg.sender_name}
                  </span>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                      isOwn
                        ? "bg-gold-500 text-white rounded-br-sm"
                        : "bg-white text-navy-700 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-navy-300 mt-0.5">
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 bg-gold-500 text-white rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-gold-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold-600 transition-all cursor-pointer hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
