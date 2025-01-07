import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Citation } from "../types/pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  activeCitation?: Citation;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  activeCitation,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement>>({});

  // console.log("file: ", file, " , activeCitation: ", activeCitation);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (activeCitation) {
      setTimeout(() => {
        scrollToPage(activeCitation.page);
      }, 100);
    }
  };

  const scrollToPage = (pageNumber: number) => {
    const pageElement = pageRefs.current[pageNumber];
    if (pageElement) {
      gsap.to(containerRef.current, {
        duration: 0.5,
        scrollTop: pageElement.offsetTop,
        ease: "power2.inOut",
      });
    }
  };

  useEffect(() => {
    if (activeCitation?.page && pageRefs.current[activeCitation.page]) {
      scrollToPage(activeCitation.page);
    }
  }, [activeCitation]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-end space-x-2 mb-4">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
            className="p-1 rounded hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
            className="p-1 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative max-h-[80vh] overflow-y-auto scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center space-y-4"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => {
                  if (el) pageRefs.current[index + 1] = el;
                }}
                className="relative"
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="border border-gray-200 rounded shadow-sm"
                  scale={scale}
                />
                <div className="absolute bottom-2 z-20 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full opacity-50">
                  {index + 1}
                </div>
              </div>
            ))}
          </Document>
        </div>
      </motion.div>
    </div>
  );
};
