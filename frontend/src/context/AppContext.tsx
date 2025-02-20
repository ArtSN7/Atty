import React, { createContext, useState } from 'react';
import { ReactNode } from 'react';


// Define the shape of your context
interface AppContextType {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    conversation: string;
    setConversation: React.Dispatch<React.SetStateAction<string>>;
}

// Create a default value
const defaultValue: AppContextType = {
    email: "",
    setEmail: () => {},
    conversation: "",
    setConversation: () => {},
  };
  
  // Create the context with the default value
  export const AppContext = createContext<AppContextType>(defaultValue);

interface AppContextProps {
    children: ReactNode;
  }

export const AppProvider = ({ children }: AppContextProps) => {

    const [email, setEmail] = useState('');
    const [conversation, setConversation] = useState('');

    return (
        <AppContext.Provider value={{ email, setEmail, conversation, setConversation}}>
            {children}
        </AppContext.Provider>
    );
};