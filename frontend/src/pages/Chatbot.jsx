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
      const response = await axios.post(`http://${window.location.hostname}:5002/chat`, {
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
          <h1 className="h1 text-center text-black bold-36">
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
          <h5 className="h5 text-center text-gray-700 mt-2 mb-4">
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
          <div className="glassmorphism h-[700px] p-5 rounded-3xl shadow-2xl w-full max-w-[420px] mx-auto relative flex flex-col border border-white/40">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-2 space-y-4"
              style={{
                maxHeight: "450px",
                minHeight: "300px",
                scrollbarWidth: "none",
              }}
            >
              {chatHistory.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-full"
                >
                  <motion.img
                    src={chatbotIcon}
                    alt="Chatbot"
                    className="w-32 h-32"
                    animate={{
                      rotate: [0, 30, -30, 0],
                      y: [0, -25, 0],
                      speed: 0.8,
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
                  className={`flex items-end max-w-[85%] ${
                    msg.sender === "user"
                      ? "ml-auto flex-row-reverse"
                      : "mr-auto"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <motion.img
                      src={chatbotSmallIcon}
                      alt="Bot"
                      className="w-8 h-8 rounded-full mr-2 bg-white border-secondary border-2 p-1 shadow-sm"
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

                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-secondary text-white rounded-br-none text-left"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100 text-left"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end max-w-[85%] mr-auto">
                  <motion.img
                    src={chatbotSmallIcon}
                    alt="Bot"
                    className="w-8 h-8 rounded-full mr-2 bg-white border-secondary border-2 p-1 shadow-sm"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 flex gap-1 items-center shadow-sm">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>
            <div className="bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/40 rounded-b-3xl">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask iFurnish..."
                className="w-full px-4 py-2.5 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition bg-white/80"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={sendMessage}
                  className="flex-1 py-2.5 bg-gradient-to-r from-secondary to-indigo-500 hover:from-secondary/90 hover:to-indigo-600 text-white rounded-xl font-medium shadow-md transition hover:-translate-y-0.5 flexCenter"
                >
                  Send <IoSend className="ml-2"/>
                </button>
                <button
                  onClick={clearChat}
                  disabled={chatHistory.length === 0}
                  className={`flex-1 py-2.5 rounded-xl flexCenter text-white transition hover:-translate-y-0.5 shadow-md ${
                    chatHistory.length === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Clear <GrClear className="ml-2"/>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  "Rules for cash on delivery?",
                  "How long does delivery take?",
                  "Can I customize furniture?",
                  "Can I view furniture in my home?",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion)}
                    className="px-3 py-1.5 text-xs bg-white/80 border border-gray-100 rounded-full hover:bg-secondary hover:text-white transition shadow-sm font-medium text-gray-600"
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
