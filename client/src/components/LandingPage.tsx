import { useState } from "react";
import { SidebarToggle } from "./SidebarToggle";
import { Sidebar } from "./Sidebar";
import ChatInterface from "./ChatInterface";

const LandingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <SidebarToggle
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 relative transition-all duration-200 ${
          isSidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        <ChatInterface />
      </div>
    </div>
  );
};

export default LandingPage;
