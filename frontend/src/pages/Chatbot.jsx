import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { IoSend, IoSparkles, IoTrashOutline } from "react-icons/io5";
import { FaRobot, FaCube, FaTruck, FaMoneyBillWave, FaPaintBrush } from "react-icons/fa";
import chatbotIcon from "../assets/chatbot2.png";
import chatbotSmallIcon from "../assets/chatbot.png";
import { Link } from "react-router-dom";

const quickPrompts = [
  { icon: FaCube, label: "3D AR View", query: "How do I view furniture in 3D AR?" },
  { icon: FaTruck, label: "Delivery Time", query: "How long does delivery take?" },
  { icon: FaMoneyBillWave, label: "Payment Options", query: "What payment methods do you accept?" },
  { icon: FaPaintBrush, label: "Customization", query: "Can I customize furniture dimensions and materials?" },
];

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your iFurnish AI Assistant. I can help you find modern furniture, explain our 3D AR features, track delivery, or answer questions about orders.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async (textToSend) => {
    const queryText = typeof textToSend === "string" ? textToSend : message;
    if (!queryText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = { sender: "user", text: queryText, time };
    
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const chatbotUrl =
        (import.meta.env.VITE_CHATBOT_URL && import.meta.env.VITE_CHATBOT_URL.trim() !== "")
          ? import.meta.env.VITE_CHATBOT_URL.trim().replace(/\/+$/, "")
          : (isLocal ? "http://localhost:5002" : "https://ifurnishshop-production-7648.up.railway.app");

      const response = await axios.post(`${chatbotUrl}/chat`, {
        message: queryText,
      }, { timeout: 25000 });
      const botText = response.data.response;

      setTimeout(() => {
        setIsTyping(false);
        let currentText = "";
        const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const botMessage = { sender: "bot", text: currentText, time: botTime };

        setChatHistory((prev) => [...prev, botMessage]);

        botText.split("").forEach((char, index) => {
          setTimeout(() => {
            currentText += char;
            setChatHistory((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                sender: "bot",
                text: currentText,
                time: botTime,
              };
              return updated;
            });
          }, index * 25);
        });
      }, 1000);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having a brief connection issue reaching the AI server. Please make sure the AI service is active and try again!",
          time: botTime,
        },
      ]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const clearChat = () => {
    setChatHistory([
      {
        sender: "bot",
        text: "Chat cleared! How else can I assist you with your furniture shopping today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#faf8f6] via-[#f7f3ed] to-[#f0e9df] min-h-screen">
      <div className="max-padd-container py-6 sm:py-10">
        {/* Page Title */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-2"
          >
            <IoSparkles className="text-sm" /> 24/7 AI Concierge
          </motion.div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            iFurnish <span className="text-secondary">Assistant</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Ask questions about dimensions, materials, AR visualization, and order status.
          </p>
        </div>

        {/* Chat Card - Ultra Responsive Flex Architecture */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col h-[76vh] min-h-[540px] max-h-[780px]"
        >
          {/* Chat Header Bar */}
          <div className="bg-gradient-to-r from-gray-900 to-tertiary text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={chatbotSmallIcon}
                  alt="Assistant"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 border border-white/20 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-gray-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                  iFurnish AI
                  <span className="text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full font-semibold">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300">Always active to help</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/collection"
                className="hidden xs:flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition font-medium"
              >
                Browse Shop
              </Link>
              <button
                onClick={clearChat}
                className="p-2 text-gray-300 hover:text-red-400 hover:bg-white/10 rounded-xl transition text-sm flexCenter"
                title="Clear Chat History"
                aria-label="Clear chat history"
              >
                <IoTrashOutline className="text-base" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white"
          >
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-2 max-w-[90%] sm:max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.sender === "bot" && (
                  <img
                    src={chatbotSmallIcon}
                    alt="Bot"
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 p-0.5 shadow-sm shrink-0 mb-1"
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm break-words ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-secondary to-[#d4795f] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200/70"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.time && (
                    <span
                      className={`text-[9px] sm:text-[10px] text-gray-400 mt-1 px-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.time}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mr-auto"
              >
                <img
                  src={chatbotSmallIcon}
                  alt="Bot"
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 p-0.5 shadow-sm"
                />
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-none bg-white border border-gray-200/70 flex gap-1.5 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 sm:px-6 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((item, index) => (
              <button
                key={index}
                onClick={() => sendMessage(item.query)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-secondary hover:text-white text-gray-700 text-xs rounded-full border border-gray-200 shadow-sm transition-all duration-200 whitespace-nowrap active:scale-95 shrink-0 font-medium"
              >
                <item.icon className="text-[11px] text-secondary group-hover:text-white" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="p-3 sm:px-5 bg-gradient-to-r from-secondary to-[#d4795f] hover:from-secondary/90 hover:to-secondary text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flexCenter gap-1.5 text-xs sm:text-sm active:scale-95 shrink-0"
                aria-label="Send Message"
              >
                <span className="hidden xs:inline">Send</span>
                <IoSend className="text-sm" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot;
