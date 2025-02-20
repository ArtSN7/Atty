// css
import './index.css'

// context
import { AppProvider } from './context/AppContext';

// router
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages
import StartingPage from './pages/StartingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'

import io from 'socket.io-client';


const socket = io("http://localhost:5000"); // Replace with your backend UR


socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("message", (data : any) => {
  console.log(data);
});

export default socket;

// main
createRoot(document.getElementById('root')!).render(
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} /> {/* starting page */}
          <Route path="/login" element={<LoginPage />} /> {/* login page */}
          <Route path="/signup" element={<SignupPage />} /> {/* signup page */}
          <Route path="/chat" element={<ChatPage />} /> {/* chat page */}
        </Routes>
      </Router>
    </AppProvider>
)