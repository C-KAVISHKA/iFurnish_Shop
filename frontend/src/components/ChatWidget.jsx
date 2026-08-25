import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSend,
  IoSparkles,
  IoTrashOutline,
  IoCopyOutline,
  IoCheckmark,
  IoClose,
  IoChevronDown,
} from "react-icons/io5";
import {
  FaCube,
  FaTruck,
  FaPaintBrush,
  FaLayerGroup,
  FaArrowRight,
} from "react-icons/fa";
import { RiRobot2Line, RiShoppingBag3Line, RiChatSmile3Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AnimatedBotIcon from "./AnimatedBotIcon";

const quickPrompts = [
  {
    icon: FaCube,
    title: "3D AR View",
    query: "How do I view furniture in 3D AR?",
  },
  {
    icon: FaPaintBrush,
    title: "Materials",
    query: "Can I customize furniture dimensions and materials?",
  },
  {
    icon: FaTruck,
    title: "Delivery",
    query: "How long does delivery take?",
  },
  {
    icon: FaLayerGroup,
    title: "Payment",
    query: "What payment methods do you accept?",
  },
];

const ChatWidget = () => {
  const { backendUrl } = useContext(ShopContext) || {};
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [message, setMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your iFurnish AI Concierge. Need help with 3D AR models, custom materials, or finding furniture?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Hide the floating widget if user is already on the dedicated /ai-assistant page
  const isDedicatedChatPage = location.pathname === "/ai-assistant";

  // Hide callout after 12 seconds or when user opens chat
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCallout(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowCallout(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, isOpen]);

  const sendMessage = async (textToSend) => {
    const queryText = typeof textToSend === "string" ? textToSend : message;
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
          console.warn(`Widget attempt on ${endpoint} failed:`, err.message);
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
      }, 200);
    } catch (error) {
      console.error("Widget chat error:", error);
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having a brief connection issue reaching the AI microservice. Please make sure the service is online and try again!",
          time: botTime,
        },
      ]);
    }
  };

  const clearChat = () => {
    setChatHistory([
      {
        sender: "bot",
        text: "Conversation cleared! How else can I assist with your furniture & design shopping?",
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

  // Render contextual deep-links inside responses
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
      <div className="flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-[#ede5df]">
        {actions.map((act, i) => (
          <Link
            key={i}
            to={act.to}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b85840]/10 hover:bg-[#b85840] text-[#b85840] hover:text-white rounded-lg text-[11px] font-semibold transition-all duration-150 border border-[#b85840]/20 active:scale-95 group"
          >
            <act.icon className="text-[10px] group-hover:scale-110 transition-transform" />
            <span>{act.label}</span>
            <FaArrowRight className="text-[8px] opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    );
  };

  if (isDedicatedChatPage) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* ── Pop-out Little Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="mb-3 w-[92vw] xs:w-[360px] sm:w-[380px] h-[500px] max-h-[78vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: "#f7f2ee",
              border: "1px solid rgba(232, 221, 213, 0.95)",
              boxShadow:
                "0 20px 45px -10px rgba(39,38,38,0.3), 0 0 0 1px rgba(255,255,255,0.7) inset",
            }}
          >
            {/* ── Terracotta Header Bar ── */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5 shrink-0 select-none"
              style={{
                background:
                  "linear-gradient(135deg, #9e4630 0%, #b85840 50%, #c6644b 100%)",
                boxShadow: "0 2px 8px rgba(184,88,64,0.25)",
              }}
            >
              {/* Profile Info */}
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flexCenter shadow-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <AnimatedBotIcon size={20} />
                  </div>
                  <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border-1.5 border-white shadow-2xs" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-xs leading-tight tracking-wide">
                      iFurnish AI Assistant
                    </h3>
                    <span className="text-[9px] font-semibold text-emerald-200 bg-black/20 px-1.5 py-0.2 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80 font-normal">
                    Instant 3D AR &amp; Interior Help
                  </p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-all duration-150 flexCenter"
                  title="Clear Chat"
                  aria-label="Clear chat"
                >
                  <IoTrashOutline className="text-sm" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-all duration-150 flexCenter"
                  title="Close Chat"
                  aria-label="Close chat"
                >
                  <IoChevronDown className="text-base" />
                </button>
              </div>
            </div>

            {/* ── Message Body ── */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2.5"
              style={{
                background: "linear-gradient(180deg, #f7f2ee 0%, #f4ede8 100%)",
              }}
            >
              {/* Quick Prompts on initial load */}
              {chatHistory.length === 1 && (
                <div
                  className="p-2.5 rounded-xl mb-1"
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    border: "1px solid #e8ddd5",
                  }}
                >
                  <div className="text-[10px] font-bold text-[#8c6d62] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <IoSparkles className="text-[#b85840]" /> Frequently Asked:
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {quickPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(item.query)}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg text-left transition-all duration-150 active:scale-[0.98] group bg-white border border-[#e5d9d0] hover:border-[#b85840] hover:bg-[#fff9f7]"
                      >
                        <item.icon className="text-[10px] text-[#b85840] shrink-0" />
                        <span className="text-[10px] font-medium text-[#3a3533] truncate">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-1.5 ${
                    msg.sender === "user"
                      ? "ml-auto flex-row-reverse max-w-[85%]"
                      : "mr-auto max-w-[90%]"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div
                      className="w-6 h-6 rounded-full flexCenter shrink-0 mb-0.5 shadow-2xs border border-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                        color: "#ffffff",
                      }}
                    >
                      <AnimatedBotIcon size={16} />
                    </div>
                  )}

                  <div className="flex flex-col group">
                    <div
                      className="px-3 py-2 text-[11px] leading-relaxed break-words relative shadow-2xs"
                      style={
                        msg.sender === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #a04a34 0%, #b85840 50%, #c6644b 100%)",
                              color: "#ffffff",
                              borderRadius: "14px 14px 2px 14px",
                              fontWeight: 500,
                            }
                          : {
                              background: "#ffffff",
                              color: "#272626",
                              borderRadius: "2px 14px 14px 14px",
                              border: "1px solid #e8ded6",
                            }
                      }
                    >
                      {msg.text}

                      {/* Smart Link Actions */}
                      {msg.sender === "bot" &&
                        msg.text &&
                        renderSmartActionButtons(msg.text)}

                      {/* Copy Action */}
                      {msg.sender === "bot" && msg.text && (
                        <button
                          onClick={() => copyToClipboard(msg.text, index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity duration-150 text-[9px] bg-[#f5ede8] text-[#8c6d62]"
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

                    {msg.time && (
                      <span
                        className={`text-[8px] mt-0.5 px-0.5 font-medium ${
                          msg.sender === "user"
                            ? "text-right text-[#a89084]"
                            : "text-left text-[#a89084]"
                        }`}
                      >
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-center gap-1.5 mr-auto">
                  <div
                    className="w-6 h-6 rounded-full flexCenter border border-white shadow-2xs"
                    style={{
                      background:
                        "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <RiRobot2Line className="text-[11px]" />
                  </div>
                  <div
                    className="px-2.5 py-1.5 flex gap-1 items-center shadow-2xs bg-white rounded-xl border border-[#e8ded6]"
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
                </div>
              )}
            </div>

            {/* ── Quick Chips Slider ── */}
            <div
              className="px-2 py-1.5 flex items-center gap-1 overflow-x-auto shrink-0 no-scrollbar"
              style={{
                borderTop: "1px solid #e8ded6",
                background: "#faf4f0",
              }}
            >
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(item.query)}
                  className="flex items-center gap-1 text-[10px] font-medium rounded-full whitespace-nowrap shrink-0 transition-all duration-150 active:scale-95 bg-white text-[#6b534b] border border-[#e2d6cc] hover:bg-[#b85840] hover:text-white hover:border-[#b85840] px-2 py-0.5"
                >
                  <item.icon className="text-[8px]" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            {/* ── Input Bar ── */}
            <div
              className="p-2 shrink-0"
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
                className="flex items-center gap-1 bg-white border border-[#e0d4ca] focus-within:border-[#b85840] rounded-xl p-1 pl-2.5 transition-all duration-150"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a question..."
                  className="flex-1 bg-transparent text-[11px] focus:outline-none py-1 placeholder:text-[#a07868]/60 text-[#272626]"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="flexCenter p-1.5 rounded-lg transition-all duration-150 active:scale-95 shrink-0 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background:
                      !message.trim() || isTyping
                        ? "#e8d0c5"
                        : "linear-gradient(135deg, #b85840 0%, #d4795f 100%)",
                  }}
                  aria-label="Send Message"
                >
                  <IoSend className="text-[10px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Tooltip / Speech Callout Bubble ── */}
      <AnimatePresence>
        {!isOpen && showCallout && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mb-2 mr-1 relative bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#e8ded6] flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-[#272626]">
              Need help? <span className="text-[#b85840]">Click here</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCallout(false);
              }}
              className="text-[#a07868] hover:text-[#272626] text-xs p-0.5 ml-0.5"
              title="Dismiss"
            >
              <IoClose />
            </button>
            {/* Triangle pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-[#e8ded6]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Circular Action Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flexCenter shadow-xl transition-all duration-300 group cursor-pointer"
        style={{
          background:
            "linear-gradient(135deg, #9e4630 0%, #b85840 50%, #d4795f 100%)",
          boxShadow:
            "0 8px 24px -4px rgba(184,88,64,0.5), 0 0 0 2px rgba(255,255,255,0.9)",
        }}
        title="iFurnish AI Interior Assistant"
        aria-label="Toggle AI Concierge Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoClose className="text-2xl text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flexCenter"
            >
              <AnimatedBotIcon size={32} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live status dot on button */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
