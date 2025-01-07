import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send } from "lucide-react";
import { useAppContext } from "../contexts/ContextProvider";
import axios from "axios";
import { PDFViewer } from "./PDFViewer";
import { PDFUpload } from "./PDFUpload";
import createToast from "../utils/createToast";

interface Source {
  source: string;
  page: number | string;
}

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  citations?: Source[];
}

// interface ChatItem {
//   question: string;
//   answer: string;
// }

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { files, session_id } = useAppContext();
  const [showPdfViewer, setShowPdfViewer] = useState(true);
  const [file, setFile] = useState<File | null>(files[0] || null);
  const [pdfPage, setPdfPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);

  // const { data, loading, error } = useGetData<ChatItem[]>(`/`);

  // console.log(data, loading);
  // if (error) {
  //   console.error(error);
  // }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue) return;
    setInputValue("");
    setIsTyping(true);
    setMessages((messages) => [
      ...messages,
      {
        id: messages.length.toString(),
        content: inputValue,
        isBot: false,
        timestamp: new Date(),
      },
    ]);
    const data = {
      session_id: session_id || "16d1d17a-d553-44f8-9d6a-fec5325bf953",
      question: inputValue,
    };
    // console.log(data);
    axios
      .post("/query", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data);
        const { citations = [], answer } = response.data;
        setMessages((messages) => [
          ...messages,

          {
            id: messages.length.toString(),
            content: answer,
            isBot: true,
            timestamp: new Date(),
            citations,
          },
        ]);
      })
      .catch((error) => {
        // drop last message
        setMessages((messages) => messages.slice(0, -1));
        createToast(`error in sending message : ${error}`, "error");
      })
      .finally(() => {
        setIsTyping(false);
      });
  };
  //   console.log(file);

  function handleCitationClick(source: Source) {
    // console.log(source);
    setShowPdfViewer(true);
    setFile(files.find((file) => file.name === source.source) || null);
    setPdfPage(Number(source.page));
  }

  return (
    <>
      <div className="flex-1 pt-2 flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {files.length > 0 && (
          <div className=" flex gap-2 p-4 pl-12 box-border bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {files.map((file, index) => (
              <div
                key={index}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap"
              >
                {file.name}
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 pl-10 overflow-y-auto p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                } mb-4`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[70%] p-4 rounded-lg ${
                    message.isBot
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p>{message.content.split("[")[0]}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {message.citations?.map((citation, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleCitationClick(citation);
                        }}
                        className="text-xs opacity-70 p-2 mt-1 block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap overflow-hidden text-ellipsis w-40"
                      >
                        {citation.source} - Page {citation.page}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg w-20"
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="p-4 pl-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="p-2 bg-blue-600 text-white rounded-full"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>
        <AnimatePresence>
          {showPdfViewer && file && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowPdfViewer(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl max-h-screen"
              >
                <PDFViewer file={file} activeCitation={{ page: pdfPage }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowUpload(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
            >
              <PDFUpload setShowUpload={setShowUpload} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!session_id && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowUpload(true)}
          className="absolute bottom-20 border-[1px] right-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
          style={{
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
            animation: "pulse 2s infinite",
          }}
        >
          <Plus size={24} />
        </motion.button>
      )}
    </>
  );
};

export default React.memo(ChatInterface);
