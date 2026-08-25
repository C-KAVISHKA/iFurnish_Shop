import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSend,
  IoSparkles,
  IoTrashOutline,
  IoCopyOutline,
  IoCheckmark,
} from "react-icons/io5";
import {
  FaCube,
  FaTruck,
  FaPaintBrush,
  FaLayerGroup,
  FaArrowRight,
} from "react-icons/fa";
import {
  RiRobot2Line,
  RiShoppingBag3Line,
} from "react-icons/ri";
import { MdAutoAwesome } from "react-icons/md";
import bgImage from "../assets/chatbot_bg.jpg";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AnimatedBotIcon from "../components/AnimatedBotIcon";

const quickPrompts = [
  {
    icon: FaCube,
    title: "3D AR View",
    query: "How do I view furniture in 3D AR?",
  },
  {
    icon: FaPaintBrush,
    title: "Materials & Fabrics",
    query: "Can I customize furniture dimensions and materials?",
  },
  {
    icon: FaTruck,
    title: "Delivery Time",
    query: "How long does delivery take?",
  },
  {
    icon: FaLayerGroup,
    title: "Payment & COD",
    query: "What payment methods do you accept?",
  },
];

const ChatBot = () => {
  const { backendUrl } = useContext(ShopContext) || {};
  const [message, setMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your iFurnish AI Concierge. Ask me about 3D AR preview, custom materials, dimensions, or order tracking!",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async (textToSend) => {
    const queryText =
      typeof textToSend === "string" ? textToSend : message;
    if (!queryText.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = { sender: "user", text: queryText, time };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const endpointsToTry = [];

      if (isLocal) {
        endpointsToTry.push("http://localhost:5002/chat");
        endpointsToTry.push("http://localhost:5000/api/chat");
      }
      if (import.meta.env.VITE_CHATBOT_URL) {
        endpointsToTry.push(
          `${import.meta.env.VITE_CHATBOT_URL.trim().replace(/\/+$/, "")}/chat`
        );
      }
      if (backendUrl) {
        endpointsToTry.push(`${backendUrl.replace(/\/+$/, "")}/api/chat`);
      } else {
        endpointsToTry.push(
          "https://ifurnishshop-production-7648.up.railway.app/chat"
        );
        endpointsToTry.push(
          "https://ifurnishshop-production.up.railway.app/api/chat"
        );
      }

      let botText = "";
      let lastError = null;

      for (const endpoint of endpointsToTry) {
        try {
          const response = await axios.post(
            endpoint,
            { message: queryText },
            { timeout: 25000 }
          );
          if (response.data && response.data.response) {
            botText = response.data.response;
            break;
          }
        } catch (err) {
          lastError = err;
          console.warn(`Attempt on ${endpoint} failed:`, err.message);
        }
      }

      if (!botText) {
        throw lastError || new Error("Connection failed");
      }

      setTimeout(() => {
        setIsTyping(false);
        let currentText = "";
        const botTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
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
          }, index * 8);
        });
      }, 250);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having a brief connection issue reaching the AI microservice. Please verify the service is running and try again!",
          time: botTime,
        },
      ]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const clearChat = () => {
    setChatHistory([
      {
        sender: "bot",
        text: "Chat cleared! How else can I assist you with your interior designs or shopping today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Contextual action buttons based on bot response content
  const renderSmartActionButtons = (text) => {
    const lower = text.toLowerCase();
    const actions = [];

    if (
      lower.includes("ar") ||
      lower.includes("3d") ||
      lower.includes("virtual") ||
      lower.includes("view")
    ) {
      actions.push({ label: "Launch 3D AR", to: "/arview", icon: FaCube });
    }
    if (
      lower.includes("custom") ||
      lower.includes("collection") ||
      lower.includes("furniture") ||
      lower.includes("catalog") ||
      lower.includes("material")
    ) {
      actions.push({
        label: "Collection",
        to: "/collection",
        icon: RiShoppingBag3Line,
      });
    }
    if (
      lower.includes("order") ||
      lower.includes("track") ||
      lower.includes("delivery")
    ) {
      actions.push({ label: "Orders", to: "/orders", icon: FaTruck });
    }

    if (actions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#ede5df]">
        {actions.map((act, i) => (
          <Link
            key={i}
            to={act.to}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b85840]/10 hover:bg-[#b85840] text-[#b85840] hover:text-white rounded-lg text-[11px] font-semibold transition-all duration-200 shadow-2xs border border-[#b85840]/20 hover:border-[#b85840] group active:scale-95"
          >
            <act.icon className="text-[10px] group-hover:scale-110 transition-transform" />
            <span>{act.label}</span>
            <FaArrowRight className="text-[8px] opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#faf8f6]">
      {/* ── Background Architectural Image Layer ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={bgImage}
          alt="iFurnish Interior Background"
          className="w-full h-full object-cover object-[center_30%]"
          style={{ filter: "brightness(0.92) contrast(1.02)" }}
        />
        {/* Soft Vignette Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,248,246,0.85) 0%, rgba(250,248,246,0.6) 45%, rgba(39,38,38,0.7) 100%)",
          }}
        />
      </div>

      {/* ── Chatbot Content Frame ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-8 max-w-3xl mx-auto w-full">
        {/* Compact Title Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-3"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#272626] tracking-tight">
            iFurnish{" "}
            <span
              className="font-serif italic"
              style={{
                background:
                  "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Assistant
            </span>
          </h1>
        </motion.div>

        {/* ── Authentic Messenger Window Card (Compact, Proportional, Warm Palette) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", damping: 26 }}
          className="w-full max-w-[560px] flex flex-col overflow-hidden shadow-2xl"
          style={{
            borderRadius: "22px",
            border: "1px solid rgba(232, 221, 213, 0.9)",
            boxShadow:
              "0 20px 50px -10px rgba(39,38,38,0.25), 0 0 0 1px rgba(255,255,255,0.8) inset",
            height: "600px",
            maxHeight: "78vh",
          }}
        >
          {/* ── Terracotta Messenger Header Bar ── */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #9e4630 0%, #b85840 50%, #c6644b 100%)",
              boxShadow: "0 2px 10px rgba(184,88,64,0.3)",
            }}
          >
            {/* Bot Profile Info */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flexCenter shadow-md"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <AnimatedBotIcon size={24} />
                </div>
                {/* Live Online Badge */}
                <span className="absolute bottom-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white shadow-xs" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-sm leading-tight tracking-wide">
                    iFurnish Concierge
                  </h2>
                  <span className="text-[10px] font-semibold text-emerald-200 bg-black/20 px-2 py-0.5 rounded-full border border-emerald-300/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">
                  3D AR &amp; Interior Shopping Guide
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              <Link
                to="/collection"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-white/15 hover:bg-white hover:text-[#b85840] px-2.5 py-1 rounded-lg transition-all duration-200 active:scale-95 border border-white/25"
                title="Browse Furniture Collection"
              >
                <RiShoppingBag3Line className="text-xs" />
                <span>Shop</span>
              </Link>
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 flexCenter"
                title="Clear Conversation"
                aria-label="Clear chat"
              >
                <IoTrashOutline className="text-sm" />
              </button>
            </div>
          </div>

          {/* ── Chat Message Stream (Warm Tone Canvas, Not Blinding White) ── */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5"
            style={{
              background:
                "linear-gradient(180deg, #f7f2ee 0%, #f4ede8 100%)",
            }}
          >
            {/* Quick Topic Pills right inside the conversation flow */}
            {chatHistory.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="p-3 rounded-xl mb-1"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid #e8ddd5",
                }}
              >
                <div className="text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MdAutoAwesome className="text-[#b85840]" /> Quick Questions:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(item.query)}
                      className="flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-150 active:scale-[0.98] group"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e5d9d0",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#b85840";
                        e.currentTarget.style.background = "#fff8f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5d9d0";
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <item.icon className="text-xs text-[#b85840] shrink-0" />
                      <span className="text-[11px] font-medium text-[#3a3533] truncate">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat History Bubbles */}
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex items-end gap-2 ${
                  msg.sender === "user"
                    ? "ml-auto flex-row-reverse max-w-[85%]"
                    : "mr-auto max-w-[88%]"
                }`}
              >
                {/* Bot Icon */}
                {msg.sender === "bot" && (
                  <div
                    className="w-7 h-7 rounded-full flexCenter shrink-0 mb-1 shadow-2xs border border-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <AnimatedBotIcon size={18} />
                  </div>
                )}

                <div className="flex flex-col group">
                  {/* Bubble */}
                  <div
                    className="px-3.5 py-2.5 text-xs leading-relaxed break-words relative shadow-xs"
                    style={
                      msg.sender === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #a04a34 0%, #b85840 50%, #c6644b 100%)",
                            color: "#ffffff",
                            borderRadius: "16px 16px 3px 16px",
                            fontWeight: 500,
                          }
                        : {
                            background: "#ffffff",
                            color: "#272626",
                            borderRadius: "3px 16px 16px 16px",
                            border: "1px solid #e8ded6",
                          }
                    }
                  >
                    {msg.text}

                    {/* Contextual Action Links */}
                    {msg.sender === "bot" &&
                      msg.text &&
                      renderSmartActionButtons(msg.text)}

                    {/* Copy Button */}
                    {msg.sender === "bot" && msg.text && (
                      <button
                        onClick={() => copyToClipboard(msg.text, index)}
                        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity duration-150 text-[10px]"
                        style={{
                          background: "#f5ede8",
                          color: "#8c6d62",
                        }}
                        title="Copy text"
                      >
                        {copiedIndex === index ? (
                          <IoCheckmark className="text-emerald-600" />
                        ) : (
                          <IoCopyOutline />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Timestamp */}
                  {msg.time && (
                    <span
                      className={`text-[9px] mt-0.5 px-1 font-medium ${
                        msg.sender === "user" ? "text-right text-[#a89084]" : "text-left text-[#a89084]"
                      }`}
                    >
                      {msg.time}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mr-auto"
              >
                <div
                  className="w-7 h-7 rounded-full flexCenter border border-white shadow-2xs"
                  style={{
                    background:
                      "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                    color: "#ffffff",
                  }}
                >
                  <RiRobot2Line className="text-xs" />
                </div>
                <div
                  className="px-3 py-2 flex gap-1 items-center shadow-xs"
                  style={{
                    background: "#ffffff",
                    borderRadius: "3px 14px 14px 14px",
                    border: "1px solid #e8ded6",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: "#b85840", animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: "#b85840", animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: "#b85840", animationDelay: "300ms" }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Quick Suggestion Chips Bar ── */}
          <div
            className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar"
            style={{
              borderTop: "1px solid #e8ded6",
              background: "#faf4f0",
            }}
          >
            {quickPrompts.map((item, index) => (
              <button
                key={index}
                onClick={() => sendMessage(item.query)}
                className="flex items-center gap-1 text-[11px] font-medium rounded-full whitespace-nowrap shrink-0 transition-all duration-150 active:scale-95"
                style={{
                  padding: "4px 10px",
                  background: "#ffffff",
                  color: "#6b534b",
                  border: "1px solid #e2d6cc",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b85840";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#b85840";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#6b534b";
                  e.currentTarget.style.borderColor = "#e2d6cc";
                }}
              >
                <item.icon className="text-[9px]" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* ── Compact Messenger Input Capsule ── */}
          <div
            className="p-2.5 shrink-0"
            style={{
              background: "#faf4f0",
              borderTop: "1px solid #e8ded6",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-1.5"
              style={{
                background: "#ffffff",
                border: "1.5px solid #e0d4ca",
                borderRadius: "14px",
                padding: "3px 4px 3px 12px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#b85840";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(184,88,64,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0d4ca";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <IoSparkles
                className="text-[#b85840] text-sm shrink-0"
                style={{ opacity: 0.8 }}
              />
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about furniture, 3D AR, dimensions..."
                className="flex-1 bg-transparent text-xs focus:outline-none py-1.5 placeholder:text-[#a07868]/60"
                style={{ color: "#272626" }}
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="flexCenter p-2 rounded-xl transition-all duration-150 active:scale-95 shrink-0"
                style={{
                  background:
                    !message.trim() || isTyping
                      ? "#e8d0c5"
                      : "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                  color: "#ffffff",
                  cursor:
                    !message.trim() || isTyping ? "not-allowed" : "pointer",
                  boxShadow:
                    !message.trim() || isTyping
                      ? "none"
                      : "0 2px 8px rgba(184,88,64,0.3)",
                }}
                aria-label="Send Message"
              >
                <IoSend className="text-xs" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* ── Storefront Footer ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default ChatBot;
