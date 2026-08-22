import React, { useRef, useState } from "react";
import heroImg from "../assets/bg.jpg";
import { BsFire } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FaPlay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const videoFiles = [
  "/videos/hero-1.mp4",
  "/videos/hero-2.mp4",
  "/videos/hero-3.mp4",
  "/videos/hero-4.mp4",
];

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

const textContainerVariants = {
  hidden: { opacity: 0 },
  show: (delay = 0.4) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: delay },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: 35, rotateX: 30 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", damping: 15, stiffness: 120 },
  },
};

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videoFiles.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideo(
      (prev) => (prev - 1 + videoFiles.length) % videoFiles.length
    );
    setIsPlaying(false);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleVideoEnd = () => nextVideo();

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);
  return (
    <section className="max-padd-container bg-hero bg-cover bg-center bg-no-repeat min-h-[580px] sm:min-h-[667px] h-auto w-full mb-10 relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl p-5 sm:p-8 lg:p-12 flex flex-col justify-between">
      {/* Dark overlay for rich contrast */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Floating Video Showcase */}
      <div
        className="relative z-10 glassmorphism p-2.5 sm:p-3 rounded-2xl sm:rounded-[1.75rem] w-fit max-w-[190px] xs:max-w-[210px] sm:max-w-[233px] shadow-2xl border border-white/30 transition-all duration-300 hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <video
            ref={videoRef}
            src={videoFiles[currentVideo]}
            className="rounded-xl sm:rounded-2xl mb-2 sm:mb-3 w-full h-auto object-cover transition-opacity duration-300 aspect-square"
            autoPlay
            loop={false}
            muted
            playsInline
            onEnded={handleVideoEnd}
            onPlay={handlePlay}
            onPause={handlePause}
          />

          {/* Play Button (Shows when video is paused) */}
          {!isPlaying && (
            <button
              className={`absolute top-1/2 left-1/2 flexCenter -translate-x-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-secondary rounded-full transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => {
                videoRef.current.play();
                setIsPlaying(true);
              }}
            >
              <span className="absolute w-full h-full rounded-full bg-white opacity-50 animate-ping"></span>
              <FaPlay className="text-sm sm:text-lg text-white" />
            </button>
          )}

          <button
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 sm:p-2 rounded-full transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
            onClick={prevVideo}
          >
            <FaArrowLeft className="text-xs sm:text-sm" />
          </button>
          <button
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 sm:p-2 rounded-full transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
            onClick={nextVideo}
          >
            <FaArrowRight className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* Description */}
        <p className="text-[11px] sm:text-[13px] text-white/90 leading-tight">
          <b className="uppercase text-secondary">UNLOCK</b> your dream home with our curated
          furniture selection
        </p>
      </div>

      {/* Main Headline & CTA */}
      <div className="relative z-10 mt-6 sm:mt-10 max-w-[777px]">
        <motion.h5
          variants={fadeDown(0.4)}
          initial="hidden"
          whileInView="show"
          className="flex items-center gap-x-2 uppercase text-secondary tracking-widest text-[11px] sm:text-xs font-bold mb-2 sm:mb-4"
        >
          URBAN AESTHETIC <BsFire />
        </motion.h5>
        <motion.h1
          variants={textContainerVariants}
          custom={0.6}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="h1 font-extrabold capitalize max-w-[722px] text-white flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2 py-1 overflow-hidden"
          style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.1" }}
        >
          {"Visualise furniture in your space with AR".split(" ").map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden">
              <motion.span variants={wordVariants} className="inline-block origin-bottom">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>
        <div className="flex mt-4 sm:mt-8">
          <Link
            to={"/collection"}
            className="bg-white hover:bg-slate-50 text-gray-800 text-xs sm:text-sm font-semibold pl-4 sm:pl-6 rounded-full flexCenter gap-x-2 sm:gap-x-4 group shadow-lg transition duration-300 hover:shadow-xl"
          >
            Check Our Modern Collection
            <FaArrowRight className="bg-secondary text-white rounded-full w-9 h-9 sm:w-12 sm:h-12 p-2.5 sm:p-3.5 m-[3px] border border-white group-hover:-rotate-[20deg] transition-all duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
