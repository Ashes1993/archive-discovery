"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export function VideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0); // New: Track download progress
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
      setShowBigPlay(true);
      setTimeout(() => setShowBigPlay(false), 600);
    } else {
      videoRef.current.pause();
      setPlaying(false);
      setShowBigPlay(true);
      setTimeout(() => setShowBigPlay(false), 600);
    }
  };

  // Skip Forward/Backward (5 seconds)
  const skip = (seconds) => {
    if (!videoRef.current) return;
    const newTime = videoRef.current.currentTime + seconds;
    videoRef.current.currentTime = Math.min(Math.max(newTime, 0), duration);
    // Update progress bar immediately for snappiness
    setProgress((videoRef.current.currentTime / duration) * 100);
  };

  // Handle Playback Progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setProgress((current / total) * 100);
    setDuration(total);
  };

  // Handle Download Progress (The "White Line")
  const handleProgress = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.buffered.length > 0) {
      // Find the buffered range that covers the current time
      for (let i = 0; i < video.buffered.length; i++) {
        if (
          video.buffered.start(i) <= video.currentTime &&
          video.buffered.end(i) >= video.currentTime
        ) {
          const bufferedEnd = video.buffered.end(i);
          setBuffered((bufferedEnd / video.duration) * 100);
          break;
        }
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      videoRef.current.volume = 0;
    } else {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl shadow-indigo-900/20 select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowVolume(false);
      }}
    >
      {/* LAYER 1: VIDEO & SPINNER WRAPPER */}
      <div
        className={`relative w-full h-full transition-all duration-300 ${buffering ? "blur-sm brightness-75" : ""}`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          onTimeUpdate={handleTimeUpdate}
          onProgress={handleProgress} // Fires as data downloads
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          preload="auto" // Optimization: Tell browser to download ahead aggressively
        />
      </div>

      {/* LAYER 2: BUFFERING SPINNER */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin shadow-2xl"></div>
        </div>
      )}

      {/* LAYER 3: BIG PLAY ANIMATION */}
      <AnimatePresence>
        {showBigPlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="bg-black/40 p-6 rounded-full backdrop-blur-md border border-white/10">
              {playing ? (
                <svg
                  className="w-12 h-12 text-white fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-white fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 4: CONTROLS OVERLAY */}
      <motion.div
        animate={{ opacity: isHovering || !playing ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-6 pt-20 transition-opacity duration-300"
      >
        {/* TIMELINE BAR */}
        <div className="group/timeline relative w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2.5 transition-all duration-300">
          {/* A. Buffered Bar (Ghost Line) */}
          <div
            className="absolute h-full bg-white/40 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${buffered}%` }}
          />

          {/* B. Played Progress (Indigo) */}
          <div
            className="absolute h-full bg-indigo-500 rounded-full z-10"
            style={{ width: `${progress}%` }}
          >
            {/* The Dot Indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/timeline:scale-100 transition-transform" />
          </div>

          {/* Input Range (Click Handler) */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Play/Pause Group */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => skip(-5)}
                className="text-white/70 hover:text-white transition-colors group/skip"
                title="-5s"
              >
                <svg
                  className="w-6 h-6 fill-current group-hover/skip:-translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
              >
                {playing ? (
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => skip(5)}
                className="text-white/70 hover:text-white transition-colors group/skip"
                title="+5s"
              >
                <svg
                  className="w-6 h-6 fill-current group-hover/skip:translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div
              className="flex items-center group/volume"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={toggleMute}
                className="text-white/90 hover:text-white transition-colors relative z-10"
              >
                {volume === 0 ? (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: showVolume ? 100 : 0,
                  opacity: showVolume ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden flex items-center ml-3"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    videoRef.current.volume = val;
                  }}
                  style={{
                    background: `linear-gradient(to right, #6366f1 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
                  }}
                  // OPTIMIZED CLASSES:
                  // 1. appearance-none removes browser default styles
                  // 2. [&::-webkit-slider-thumb] targets Chrome/Safari thumb
                  // 3. We make the thumb a clean white circle (w-3 h-3) with a shadow
                  className="w-24 h-1 rounded-full appearance-none cursor-pointer outline-none 
                 [&::-webkit-slider-thumb]:appearance-none 
                 [&::-webkit-slider-thumb]:w-3 
                 [&::-webkit-slider-thumb]:h-3 
                 [&::-webkit-slider-thumb]:rounded-[50%] 
                 [&::-webkit-slider-thumb]:bg-white 
                 [&::-webkit-slider-thumb]:shadow-md 
                 [&::-webkit-slider-thumb]:hover:scale-125 
                 [&::-webkit-slider-thumb]:transition-transform
                 [&::-moz-range-thumb]:appearance-none 
                 [&::-moz-range-thumb]:w-3 
                 [&::-moz-range-thumb]:h-3 
                 [&::-moz-range-thumb]:rounded-full 
                 [&::-moz-range-thumb]:bg-white 
                 [&::-moz-range-thumb]:border-none"
                />
              </motion.div>
            </div>

            {/* Time Stamp */}
            <span className="text-white/80 text-xs font-mono tracking-wider">
              {formatTime(videoRef.current?.currentTime)}{" "}
              <span className="opacity-50">/</span> {formatTime(duration)}
            </span>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
