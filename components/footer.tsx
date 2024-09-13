import { ThemeToggle } from "@/components/theme-toggle";

export default function Footer() {
  return (
    <footer className="bg-card/5 backdrop-blur-xl fixed bottom-0 left-0 right-0 z-30">
      <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-3 flex flex-col md:flex-row items-center justify-between">
        <p className="text-2xl font-bebas-neue hidden md:block md:text-base opacity-70 text-center md:text-left md:mr-4">&copy; 2022-{new Date().getFullYear()} Thomas Wainwright. All rights reserved.</p>
        <div className="mt-2 md:mt-0 md:ml-auto"><ThemeToggle/></div>
      </div>
    </footer>
  );
}