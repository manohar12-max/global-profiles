import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import UserContextProvider from './context/UserContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <UserContextProvider>
    <Router>
      <App />
    </Router>
    </UserContextProvider>
  </StrictMode>,
)
