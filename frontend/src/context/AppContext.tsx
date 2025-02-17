import React, { createContext, useState } from 'react';
import { ReactNode } from 'react';


// Define the shape of your context
interface AppContextType {
    messageText: string;
    setMessageText: React.Dispatch<React.SetStateAction<string>>;
    messageUsername: string;
    setMessageUsername: React.Dispatch<React.SetStateAction<string>>;
}

// Create a default value
const defaultValue: AppContextType = {
    messageText: "",
    setMessageText: () => {},
    messageUsername: "",
    setMessageUsername: () => {},
  };
  
  // Create the context with the default value
  export const AppContext = createContext<AppContextType>(defaultValue);

interface AppContextProps {
    children: ReactNode;
  }

export const AppProvider = ({ children }: AppContextProps) => {
    const [messageText, setMessageText] = useState("");
    const [messageUsername, setMessageUsername] = useState("");

    return (
        <AppContext.Provider value={{ messageText, setMessageText, messageUsername, setMessageUsername}}>
            {children}
        </AppContext.Provider>
    );
};