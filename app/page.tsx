'use client'
import { useState } from 'react'
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Eye, Ear } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"
import { useTheme } from 'next-themes'
import Image from 'next/image'

export default function SensoryExperienceLanding() {
  const { theme } = useTheme()

  const isDarkTheme = theme === 'dark'

  const cardVariants = {
    hover: {
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Image
        src="https://res.cloudinary.com/dsbsn3nap/image/upload/v1726000825/Lushuous_Landscape_ghgau1.png"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
      />
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border relative z-10">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">Sensory Experience</span>
          <Eye className="h-6 w-6 text-foreground mr-2" />
          <Ear className="h-6 w-6 text-foreground" />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-accent transition-colors" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-accent transition-colors" href="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/10"></div>
        <section className="relative z-10 w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              {[
                { title: "Eyes", icon: Eye, href: "/art" },
                { title: "Ears", icon: Ear, href: "/audio" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="w-full max-w-[200px]"
                  whileHover="hover"
                  variants={cardVariants}
                >
                  <Link href={item.href}>
                    <MagicCard
                      className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 aspect-square bg-opacity-50 backdrop-filter backdrop-blur-xl"
                      gradientColor='foreground'
                      gradientSize={200}
                      gradientOpacity={0.8}
                    >
                      <div className="relative p-4 flex flex-col items-center justify-center h-full backdrop-blur-xl">
                        <item.icon className="h-12 w-12 mb-2" />
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                      </div>
                    </MagicCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}