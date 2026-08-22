import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { IoSend } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import chatbotIcon from "../assets/chatbot2.png";
import chatbotSmallIcon from "../assets/chatbot.png";

const fadeDown = (delay) => {
  return {
    hidden: { opacity: 0, y: -100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeRight = (delay) => {
  return {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const fadeLeft = (delay) => {
  return {
    hidden: { opacity: 0, x: 100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
};

const sentence = "Your personal 24/7 AI assistant for all your furniture needs";

const textVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.08,
    },
  }),
};

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    setIsTyping(true);
    try {
      const chatbotUrl = import.meta.env.VITE_CHATBOT_URL || `http://${window.location.hostname}:5002`;
      const response = await axios.post(`${chatbotUrl}/chat`, {
        message,
      });
      const botText = response.data.response;

      setTimeout(() => {
        setIsTyping(false);
        let currentText = "";
        const botMessage = { sender: "bot", text: currentText };

        setChatHistory((prev) => [...prev, botMessage]);

        botText.split("").forEach((char, index) => {
          setTimeout(() => {
            currentText += char;
            setChatHistory((prev) => {
              const updatedHistory = [...prev];
              updatedHistory[updatedHistory.length - 1] = {
                sender: "bot",
                text: currentText,
              };
              return updatedHistory;
            });
          }, index * 50);
        });
      }, 2200);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setIsTyping(false);
    }

    setMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [chatHistory]);

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="bg-gradient-to-b from-[#faf8f6] via-[#f7f3ed] to-[#f0e9df] min-h-screen">
      <div className="bg-primary/20 mb-16 bg-cb bg-cover bg-center bg-no-repeat w-full">
        <div className="max-padd-container py-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-black mb-1">
            <motion.span
              variants={fadeLeft(0.4)}
              initial="hidden"
              whileInView="show"
              className="font-bold text-secondary"
            >
              iFurnish
            </motion.span>
            <motion.span
              variants={fadeDown(0.8)}
              initial="hidden"
              whileInView="show"
              className="font-semibold text-tertiary"
            >
              {" "}
              Assistant
            </motion.span>
          </h1>
          <h5 className="text-xs sm:text-sm text-center text-gray-600 mt-1 mb-4 max-w-md mx-auto">
            {sentence.split("").map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {char}
              </motion.span>
            ))}
          </h5>
          <div className="glassmorphism min-h-[500px] max-h-[82vh] h-auto p-3 sm:p-5 rounded-3xl shadow-2xl w-full max-w-[440px] mx-auto relative flex flex-col border border-white/40">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-2 space-y-3"
              style={{
                maxHeight: "420px",
                minHeight: "260px",
                scrollbarWidth: "none",
              }}
            >
              {chatHistory.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-full py-8"
                >
                  <motion.img
                    src={chatbotIcon}
                    alt="Chatbot"
                    className="w-24 h-24 sm:w-32 sm:h-32"
                    animate={{
                      rotate: [0, 30, -30, 0],
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end max-w-[88%] ${
                    msg.sender === "user"
                      ? "ml-auto flex-row-reverse"
                      : "mr-auto"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <motion.img
                      src={chatbotSmallIcon}
                      alt="Bot"
                      className="w-7 h-7 rounded-full mr-1.5 bg-white border-secondary border p-0.5 shadow-sm shrink-0"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm break-words ${
                      msg.sender === "user"
                        ? "bg-secondary text-white rounded-br-none ml-2"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100 mr-2"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 mr-auto">
                  <img
                    src={chatbotSmallIcon}
                    alt="Bot"
                    className="w-7 h-7 rounded-full bg-white border-secondary border p-0.5 shadow-sm"
                  />
                  <div className="px-3.5 py-2 rounded-2xl rounded-bl-none bg-white border border-gray-100 flex gap-1 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>
            <div className="bottom-0 left-0 right-0 p-2.5 sm:p-4 border-t border-white/30 bg-white/50 rounded-b-3xl mt-auto">
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-1.5 items-center"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about furniture, delivery, AR..."
                  className="flex-1 px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition bg-white/90"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 sm:py-2.5 sm:px-4 bg-secondary text-white rounded-xl font-medium shadow-md transition disabled:opacity-50 flexCenter"
                  aria-label="Send message"
                >
                  <IoSend className="text-sm sm:text-base"/>
                </button>
                <button
                  type="button"
                  onClick={clearChat}
                  disabled={chatHistory.length === 0}
                  className="p-2 sm:py-2.5 sm:px-3 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition disabled:opacity-40 flexCenter"
                  aria-label="Clear chat"
                >
                  <GrClear className="text-sm"/>
                </button>
              </form>

              {/* Suggestions row - horizontally scrollable on mobile */}
              <div className="flex overflow-x-auto gap-1.5 mt-2.5 pb-1 no-scrollbar">
                {[
                  "Delivery time?",
                  "Cash on delivery?",
                  "Can I customize?",
                  "How to use 3D AR?",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion)}
                    className="px-2.5 py-1 text-[10px] sm:text-xs bg-white/90 border border-gray-200/60 rounded-full hover:bg-secondary hover:text-white transition shadow-sm font-medium text-gray-600 whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot;
