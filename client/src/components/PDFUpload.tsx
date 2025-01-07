import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Upload } from "lucide-react";
import { useAppContext } from "../contexts/ContextProvider";
import axios from "axios";
import createToast from "../utils/createToast";
import Loader from "./Loader";

// interface FileWithPreview extends File {
//   preview?: string;
// }

export const PDFUpload = ({
  setShowUpload,
}: {
  setShowUpload: (show: boolean) => void;
}) => {
  // const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { setFiles, files, setSessionId } = useAppContext();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      setFiles([...files]);
    }
  };

  const removeFile = (name: string) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  const handleUpload = () => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          }
        },
      })
      .then((res) => {
        // setFiles([]);
        const session_ids = JSON.parse(
          localStorage.getItem("session_ids") || "[]"
        );
        localStorage.setItem(
          "session_ids",
          JSON.stringify([...session_ids, res.data.session_id])
        );
        setSessionId(res.data.session_id);
        // console.log(res.data);
        createToast("Files uploaded successfully", "success");
      })
      .catch((error) => {
        setFiles([]);
        createToast(`Error uploading files : ${error} `, "error");
      })
      .finally(() => {
        setUploading(false);
        setUploadProgress(0);
        setShowUpload(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto transition-colors duration-200"
    >
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${"border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FileText
            size={48}
            className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300">
            {"Drag 'n' drop PDF files here, or click to select files"}
          </p>
        </motion.div>
        <label className="mt-4 inline-block">
          <input
            type="file"
            className="hidden"
            multiple
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files) {
                setFiles([...files, ...Array.from(e.target.files)]);
              }
            }}
          />
          <span className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
            Browse Files
          </span>
        </label>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 max-h-80 overflow-y-auto px-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {file.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(file.name)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X size={20} />
                </motion.button>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              {uploading ? (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 transition-colors duration-200">
                  <motion.div
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                  <Loader text="Uploading the files" />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Upload size={20} />
                  Upload Files
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
