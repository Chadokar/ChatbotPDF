import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { useAppContext } from "../contexts/ContextProvider";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../utils/cn";
import createToast from "../utils/createToast";

// interface ChatItem {
//   id: string;
//   title: string;
//   timestamp: string;
//   isActive?: boolean;
// }

interface SidebarProps {
  isOpen: boolean;
}

// const chatItems: ChatItem[] = JSON.parse(
//   localStorage.getItem("chatItems") || "[]"
// );

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const { setSessionId, session_id } = useAppContext();

  const session_ids = JSON.parse(localStorage.getItem("session_ids") || "[]");

  function handleClick(id: string) {
    setSessionId(id);
    createToast("You can chat for session " + id, "success");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 bg-white dark:bg-gray-900 h-screen p-4 flex flex-col fixed left-0 top-0 z-40 shadow-lg border-r border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-900 dark:text-white text-xl font-bold"
            >
              PDF Chat
            </motion.h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <Settings size={20} />
              </motion.button> */}
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg mb-6"
            href="/"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </motion.a>

          <div className="flex-1 h-max-[calc(100%-4rem)] overflow-y-auto">
            {session_ids.map((id: string, idx: number) => (
              <motion.button
                onClick={() => handleClick(id)}
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-3 rounded-lg mb-2 cursor-pointer flex items-center gap-1",
                  session_id === id
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <FileText
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 flex dark:text-white text-sm font-medium">
                    {id}
                  </h3>
                  {/* <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {chat.timestamp}
                  </p> */}
                </div>
              </motion.button>
            ))}
          </div>
          <span className="text-red-500 dark:text-red-400 text-xs">
            * Citations will only be available for PDFs uploaded after reload
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
