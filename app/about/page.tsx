'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useColors } from "@/app/context/color-context"
import { generateColorTones } from "@/utils/color-utils"

export default function AboutPage() {
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false)
  const { colorTones, lastViewedArtworkUrl } = useColors();
  const scrollRef = useRef(null);

  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  // Default image if no artwork URL is set
  const defaultImageUrl = "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726000825/Lushuous_Landscape_ghgau1.png";
  const currentImageUrl = lastViewedArtworkUrl || defaultImageUrl;

  // Set up parallax effect
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  // Enhanced parallax effects with more dramatic movement and motion blur
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.3, 1.8]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const parallaxBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, 6]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0.6]);
  
  // For mobile header parallax
  const mobileHeaderHeight = useTransform(
    scrollYProgress, 
    [0, 0.2], 
    ["50vh", "20vh"]
  );

  // For enhanced mobile effects
  const mobileParallaxScale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1.6]);
  const mobileParallaxBlur = useTransform(scrollYProgress, [0, 0.5], [0, 4]);

  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrMobile(window.innerWidth <= 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Creating references for scroll-triggered animations
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const outroRef = useRef(null);

  // Scroll animation variants with more dramatic effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.7,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  }

  // Text reveal animation variants
  const textRevealVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  // Staggered text animation variants
  const staggeredItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ease-in-out relative"
      style={{ 
        backgroundColor: currentColorTones[1][5],
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Mobile/Tablet Image Header - shrinks as you scroll */}
      {isTabletOrMobile && (
        <motion.div 
          className="fixed top-0 left-0 w-full overflow-hidden z-0"
          style={{ 
            height: mobileHeaderHeight,
            scale: mobileParallaxScale,
            filter: `blur(${mobileParallaxBlur.get()}px)`,
            transition: 'filter 0.1s ease-out'
          }}
        >
          <Image
            src={currentImageUrl}
            alt="Background"
            fill
            style={{ 
              objectFit: "cover",
              objectPosition: "center 30%"
            }}
            priority
            quality={95}
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      )}
      
      {/* Desktop Image with enhanced parallax */}
      {!isTabletOrMobile && (
        <motion.div 
          className="fixed top-0 left-0 w-1/2 h-screen z-0 overflow-hidden"
          style={{ 
            y: parallaxY,
            scale: parallaxScale,
            rotateZ: parallaxRotate,
            filter: `blur(${parallaxBlur.get()}px)`,
            opacity: parallaxOpacity,
            transformOrigin: "center center",
            transition: 'filter 0.1s ease-out'
          }}
        >
          <Image
            src={currentImageUrl}
            alt="Background"
            fill
            style={{ 
              objectFit: "cover", 
              objectPosition: "center 30%"
            }}
            priority
            quality={95}
          />
          <motion.div 
            className="absolute inset-0 bg-black/30"
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.6])
            }}
          />
        </motion.div>
      )}
      
      {/* Content Section */}
      <div 
        className={`
          relative
          w-full 
          ${!isTabletOrMobile ? 'ml-[50%] w-1/2' : 'mt-[45vh]'} 
          p-4 md:p-8 ${!isTabletOrMobile ? 'pt-16 md:pt-24 lg:pt-32' : 'pt-8'}
          overflow-y-auto min-h-screen z-10
        `}
        style={{ 
          backgroundColor: currentColorTones[1][5],
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="mx-auto relative space-y-24 md:space-y-40">
          {/* Title Section */}
          <motion.div 
            ref={titleRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={textRevealVariants}
            className="mb-8 md:mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 md:mb-8" style={{ color: currentColorTones[1][2] }}>
              About
            </h1>
            <motion.p 
              variants={staggeredItemVariants}
              className="text-lg md:text-2xl leading-relaxed max-w-3xl text-pretty" 
              style={{ color: currentColorTones[1][2] }}
            >
              Help, I&apos;m fine. is a project exploring the intersection of <span className="font-semibold font-bebas-neue text-2xl md:text-3xl" style={{ color: currentColorTones[1][2] }}>digital collage</span> and <span className="font-semibold font-bebas-neue text-2xl md:text-3xl" style={{ color: currentColorTones[1][2] }}>artificial intelligence</span>. My creative process is built around two key steps:
            </motion.p>
          </motion.div>

          <div className="space-y-32 md:space-y-48">
            {/* Step 1 */}
            <motion.div
              ref={step1Ref}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={containerVariants}
            >
              <CoolProcessStep
                number="01"
                title="Human Creation"
                description={[
                  "I create playful collages by incorporating photographs captured while I'm out and about, with abstract shapes and colours.",
                  "Drawing inspiration from my surroundings, I integrate colour palettes, textures, and forms observed in my natural and urban environments."
                ]}
                colorTones={currentColorTones}
              />
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              ref={step2Ref}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={containerVariants}
            >
              <CoolProcessStep
                number="02"
                title="AI Curation"
                description={[
                  "The source collage serves as the creative foundation, working with the prompt to guide the generative AI to shape the final work's colour, composition, and overall aesthetic.",
                  "I carefully refine the prompts and curate the AI outputs, exploring multiple iterations to bring my artistic vision to life."
                ]}
                colorTones={currentColorTones}
              />
            </motion.div>
          </div>

          {/* Outro */}
          <motion.div 
            ref={outroRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            variants={textRevealVariants}
            className="mt-16 mb-28 md:mt-32"
          >
            <p className="text-lg md:text-2xl max-w-3xl text-pretty" style={{ color: currentColorTones[1][2] }}>
            The written descriptions of the artwork are generated by AI after I upload an image and provide some context. Alongside my visual art, I also curate playlists and sometimes create mixes, combining tracks to build distinct soundscapes.</p>    
          </motion.div>
          
          {/* Simple Copyright Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-center py-8 mt-auto"
          >
            <p className="text-md font-bebas-neue opacity-70" style={{ color: currentColorTones[1][3] }}>
             &copy;  {new Date().getFullYear()} Thomas Wainwright. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function CoolProcessStep({ number, title, description, colorTones }: { number: string; title: string; description: string[]; colorTones: string[][] }) {
  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const numberVariants = {
    hidden: { 
      opacity: 0.1, 
      x: -50,
      scale: 0.9
    },
    visible: { 
      opacity: 0.2, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={stepVariants}
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 md:gap-8 max-w-6xl"
    >
      <motion.div variants={numberVariants} className="sm:col-span-2">
        <span className="text-6xl md:text-9xl font-black leading-none font-bebas-neue" style={{ color: colorTones[1][2], opacity: 0.2 }}>
          {number}
        </span>
      </motion.div>
      <div className="sm:col-span-10">
        <motion.h2 variants={itemVariants} className="text-2xl md:text-4xl mb-4 md:mb-6" style={{ color: colorTones[1][2] }}>
          {title}
        </motion.h2>
        <div className="space-y-4 md:space-y-6">
          {description.map((paragraph: string, index: number) => (
            <motion.p key={index} variants={itemVariants} className="text-base md:text-2xl text-pretty" style={{ color: colorTones[1][2] }}>
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}