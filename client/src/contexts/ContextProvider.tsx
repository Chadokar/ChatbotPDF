import React, { createContext } from "react";

interface ContextProps {
  data: any;
  files: File[];
  setFiles: (files: File[]) => void;
  session_id?: string;
  setSessionId: (session_id: string | undefined) => void;
}

const Context = createContext<ContextProps | undefined>(undefined);

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [session_id, setSessionId] = React.useState<string | undefined>();

  return (
    <Context.Provider
      value={{
        data: {},
        files,
        setFiles,
        session_id,
        setSessionId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;

export const useAppContext: () => ContextProps = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};
