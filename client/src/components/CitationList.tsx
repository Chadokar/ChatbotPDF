import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Citation } from "../types/pdf";

interface CitationListProps {
  citations: Citation[];
  onCitationClick: (citation: Citation) => void;
}

export const CitationList: React.FC<CitationListProps> = ({
  citations,
  onCitationClick,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6">Citations</h2>
        <div className="space-y-4">
          {citations.map((citation, index) => (
            <motion.button
              key={index}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCitationClick(citation)}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Page {citation.page}</p>
                  <p className="text-sm text-gray-600 mt-1">{citation.text}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
