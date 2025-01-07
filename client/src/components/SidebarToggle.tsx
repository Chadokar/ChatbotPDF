import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

export const SidebarToggle = ({ isOpen, toggle }: SidebarToggleProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className={`fixed z-50 p-2 top-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ${
        isOpen ? "left-[20.5rem]" : "left-2"
      }`}
    >
      <motion.div
        animate={{ rotate: isOpen ? 0 : 180 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronLeft size={20} />
      </motion.div>
    </motion.button>
  );
};
