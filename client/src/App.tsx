// import React, { useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import { gsap } from "gsap";
// import { PDFUploader } from "./components/PDFUploader";
// import { PDFViewer } from "./components/PDFViewer";
// import { CitationList } from "./components/CitationList";
// import { PDFFile, Citation } from "./types/pdf";
// import { getRandomPage } from "./utils/pdf";

// export default function App() {
//   const [pdfs, setPdfs] = useState<PDFFile[]>([]);
//   const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null);
//   const [selectedPage, setSelectedPage] = useState<number>(1);
//   const [activeCitation, setActiveCitation] = useState<Citation | undefined>();

//   const handleFileSelect = useCallback((files: FileList) => {
//     const newPdfs = Array.from(files).map((file) => {
//       const pdfId = Math.random().toString(36).substr(2, 9);

//       const citationCount = Math.floor(Math.random() * 3) + 1;
//       const citations = Array.from({ length: citationCount }, () => ({
//         // id: Math.random().toString(36).substr(2, 9),
//         // pdfId,
//         page: getRandomPage(),
//         // text: `Citation from ${file.name} - Page ${getRandomPage()}`,
//       }));

//       return {
//         // id: pdfId,
//         file,
//         name: file.name,
//         citations,
//       };
//     });
//     console.log(newPdfs);

//     setPdfs((prev) => [...prev, ...newPdfs]);

//     gsap.from(".pdf-item", {
//       opacity: 0,
//       y: 20,
//       stagger: 0.1,
//       duration: 0.5,
//       ease: "power2.out",
//     });
//   }, []);

//   const handleRemoveFile = useCallback((id: string) => {
//     setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
//     setSelectedPdf((prev) => (prev?.id === id ? null : prev));
//     setActiveCitation(undefined);
//   }, []);

//   const handleUpload = useCallback(() => {
//     gsap.to(".upload-progress", {
//       width: "100%",
//       duration: 1,
//       ease: "power2.inOut",
//     });
//   }, []);

//   const handleCitationClick = useCallback(
//     (citation: Citation) => {
//       const pdf = pdfs.find((p) => p.id === citation.pdfId);
//       if (pdf) {
//         setSelectedPdf(pdf);
//         setSelectedPage(citation.page);
//         setActiveCitation(citation);
//       }
//     },
//     [pdfs]
//   );

//   return (
//     <motion.div
//       className="min-h-screen bg-gray-100"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <div className="container mx-auto py-12">
//         <motion.h1
//           className="text-4xl font-bold text-center mb-12"
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//         >
//           PDF Manager
//         </motion.h1>

//         <PDFUploader
//           onFileSelect={handleFileSelect}
//           selectedFiles={pdfs}
//           onRemoveFile={handleRemoveFile}
//           onUpload={handleUpload}
//         />

//         {selectedPdf && (
//           <PDFViewer file={selectedPdf.file} activeCitation={activeCitation} />
//         )}

//         <CitationList
//           citations={pdfs.flatMap((pdf) => pdf.citations)}
//           onCitationClick={handleCitationClick}
//         />
//       </div>
//     </motion.div>
//   );
// }

// import LandingPage from "./components/LandingPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import ContextProvider from "./contexts/ContextProvider";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import React from "react";
import Loader from "./components/Loader";

const LazyLandingPage = React.lazy(() => import("./components/LandingPage"));

export default function App() {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
  return (
    <ThemeProvider>
      <ContextProvider>
        <React.Suspense fallback={<Loader />}>
          <LazyLandingPage />
        </React.Suspense>
        <ToastContainer />
      </ContextProvider>
    </ThemeProvider>
  );
}
