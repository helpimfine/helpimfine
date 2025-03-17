import { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Logo } from './logo';

export function AnimatedLogo({ 
  className, 
  style, 
  shock = false,
  onShockComplete = () => {}
}: { 
  className?: string, 
  style?: React.CSSProperties,
  shock?: boolean,
  onShockComplete?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();
  const filterControls = useAnimationControls();
  
  // Watch for external shock prop
  useEffect(() => {
    if (shock) {
      triggerShockAnimation();
    }
  }, [shock]);
  
  // Electric shock effect
  const triggerShockAnimation = () => {
    // Random intensity for the shock (1-3)
    const intensity = Math.floor(Math.random() * 3) + 1;
    const speed = 0.7 / intensity;
    
    // Violent shaking with higher amplitude for stronger shocks
    controls.start({
      x: [0, -6 * intensity, 8 * intensity, -9 * intensity, 7 * intensity, -5 * intensity, 
          4 * intensity, -3 * intensity, 2 * intensity, -1 * intensity, 0],
      y: [0, 5 * intensity, -7 * intensity, 3 * intensity, -5 * intensity, 3 * intensity, 
          -2 * intensity, 1 * intensity, 0],
      rotate: [0, -2 * intensity, 3 * intensity, -3 * intensity, 2 * intensity, -1 * intensity, 
              0.5 * intensity, 0],
      scale: [1, 1.1, 0.95, 1.05, 0.97, 1.03, 1],
      transition: {
        duration: speed,
        ease: "backOut",
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 0.9, 1],
        onComplete: () => {
          if (!isHovered) {
            // Reset to normal after shock if not hovered
            resetAnimation();
            onShockComplete(); // Callback when shock is complete
          }
        }
      }
    });
    
    // Bright electric flash with glow effect incorporated
    filterControls.start({
      filter: [
        "brightness(1) contrast(1) drop-shadow(0 0 0 transparent)",
        "brightness(3) contrast(2) drop-shadow(0 0 15px cyan)",
        "brightness(1.5) contrast(1.2) drop-shadow(0 0 5px rgba(0, 200, 255, 0.7))",
        "brightness(2.5) contrast(1.8) drop-shadow(0 0 20px white)",
        "brightness(1) contrast(1) drop-shadow(0 0 0 transparent)"
      ],
      transition: {
        duration: speed * 0.8,
        ease: "easeOut",
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    });
  };
  
  // Reset all animations
  const resetAnimation = () => {
    controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    });
    
    filterControls.start({
      filter: "brightness(1) contrast(1) drop-shadow(0 0 0 transparent)",
      transition: { duration: 0.3 }
    });
  };
  
  // Electric shock effect when hovered
  const handleHoverStart = () => {
    setIsHovered(true);
    triggerShockAnimation();
    
    // Set up continuous subtle shock effect for hover state
    setTimeout(() => {
      if (isHovered) {
        controls.start({
          x: [0, -2, 3, -3, 2, -1, 1, 0],
          y: [0, 1, -2, 1, -1, 1, 0],
          rotate: [0, -0.5, 1, -1, 0.5, 0],
          scale: [1, 1.02, 0.99, 1.01, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        });
      }
    }, 800);
  };
  
  const handleHoverEnd = () => {
    setIsHovered(false);
    resetAnimation();
  };
  
  return (
    <motion.div
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileTap={{ scale: 0.92 }}
      style={{
        ...style,
        display: "inline-block",
        position: "relative"
      }}
    >
      {/* Main logo with electric movement */}
      <motion.div
        animate={controls}
        style={{ display: 'inline-block' }}
      >
        {/* Filter effects */}
        <motion.div
          animate={filterControls}
          style={{ lineHeight: 0 }} // Remove extra spacing
        >
          <Logo className={className} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 