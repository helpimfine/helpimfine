'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { Eye, Ear } from "lucide-react"
import { useTheme } from 'next-themes'
import Image from 'next/image'

const icons = [
  { name: "eye", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355897/Homepage/eye1_egafgx.png" },
  { name: "ball", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355896/Homepage/eye2_aet7gu.png" },
  { name: "nose", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355896/Homepage/eye3_crxuia.png" },
  { name: "mouth", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355896/Homepage/eye4_poyhnz.png" },
  { name: "ear", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355893/Homepage/ear2_dze9j8.png" },
  { name: "ear-nose", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355893/Homepage/ear2_dze9j8.png" },
  { name: "ear-face", src: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726355893/Homepage/ear3_udrhng.png" },
];

export default function SensoryExperienceLanding() {
  const { theme } = useTheme()
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const controls = useAnimation()

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    controls.start(i => ({
      x: Math.random() * 30 - 15,
      y: Math.random() * 30 - 15,
      rotate: Math.random() * 10 - 5,
      transition: { repeat: Infinity, repeatType: "reverse", duration: 3 + i * 0.5 }
    }))
  }, [controls])

  const handleMouseEnter = useCallback(() => {
    controls.start(i => ({
      scale: 1.2,
      rotate: Math.random() * 20 - 10,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }))
  }, [controls])

  const handleMouseLeave = useCallback(() => {
    controls.start(i => ({
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }))
  }, [controls])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <div className="flex-1 flex flex-col md:flex-row">
        {[
          { title: "Eyes", icon: Eye, href: "/art", type: "eye", bgColor: "#A5CFC7" },
          { title: "Ears", icon: Ear, href: "/audio", type: "ear", bgColor: "#B55D44" }
        ].map((item, index) => (
          <div 
            key={index} 
            className="flex-1 relative overflow-hidden" 
            style={{ backgroundColor: item.bgColor }}
          >
            <Link 
              href={item.href} 
              className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 md:p-10
                ${item.type === 'eye' ? 'md:pt-20 md:pb-20 pt-20 pb-6' : 'md:pt-20 md:pb-20 pt-6 pb-20'}
                group cursor-pointer`}
            >
              <motion.h2 
                className="text-3xl md:text-6xl font-bold mb-4 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.title}
              </motion.h2>
              <div className="relative flex-1 w-full max-w-[80%] max-h-[60%] md:max-w-[70%] md:max-h-[70%]">
                {icons
                  .filter((icon) => icon.name.startsWith(item.type))
                  .map((icon, i) => {
                    let position, size, zIndex;
                    const baseSize = Math.min(windowSize.width, windowSize.height) * (windowSize.width < 768 ? 0.2 : 0.3);
                    if (item.type === 'ear') {
                      switch (icon.name) {
                        case 'ear':
                          position = { top: '10%', left: '10%' };
                          size = baseSize * 0.9;
                          zIndex = 3;
                          break;
                        case 'ear-nose':
                          position = { top: '5%', left: '30%' };
                          size = baseSize * 0.95;
                          zIndex = 2;
                          break;
                        case 'ear-face':
                          position = { bottom: '10%', right: '5%' };
                          size = baseSize * 1;
                          zIndex = 1;
                          break;
                      }
                    } else { // eye
                      switch (icon.name) {
                        case 'eye':
                          position = { top: '20%', right: '30%' };
                          size = baseSize * 1;
                          zIndex = 3;
                          break;
                        case 'eye-ball':
                          position = { top: '45%', right: '20%' };
                          size = baseSize * 0.15;
                          zIndex = 4;
                          break;
                        case 'eye-nose':
                          position = { top: '15%', right: '20%' };
                          size = baseSize * 0.31;
                          zIndex = 2;
                          break;
                        case 'eye-mouth':
                          position = { bottom: '10%', left: '15%' };
                          size = baseSize * 0.95;
                          zIndex = 1;
                          break;
                      }
                    }

                    return (
                      <motion.div
                        key={icon.name}
                        className="absolute cursor-pointer"
                        style={{ ...position, zIndex }}
                        animate={controls}
                        custom={i}
                        whileHover={{
                          scale: 1.3,
                          rotate: Math.random() * 30 - 15,
                          transition: { type: "spring", stiffness: 300, damping: 10 }
                        }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        drag
                        dragConstraints={{
                          top: -50,
                          left: -50,
                          right: 50,
                          bottom: 50,
                        }}
                        dragElastic={0.5}
                      >
                        <Image 
                          src={icon.src} 
                          alt={icon.name} 
                          width={size}
                          height={size}
                          className="w-auto h-auto md:w-full md:h-full pointer-events-none"
                        />
                      </motion.div>
                    );
                  })}
              </div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mt-4 md:mt-8"
              >
                <item.icon className="h-8 w-8 md:h-16 md:w-16" />
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}