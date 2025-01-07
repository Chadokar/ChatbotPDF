import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading" }) => {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    gsap.to(circle, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 bg-opacity-50 dark:bg-gray-900 backdrop-blur-sm z-50">
      <div className="relative flex flex-col items-center w-40 h-60 justify-start">
        <div
          ref={circleRef}
          className="absolute w-20 h-20 rounded-full border-4 border-transparent top-12"
          style={{
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            maskImage: "radial-gradient(transparent 55%, black 60%)",
            WebkitMaskImage: "radial-gradient(transparent 55%, black 60%)",
          }}
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center z-10"
        >
          {/* <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-white" />
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-white font-medium"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {text}
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
