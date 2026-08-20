import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import LibraryPage from "./pages/librarypage";
import ProfileEditPage from "./pages/profileeditpage";

export default function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mylibrary" element={<LibraryPage />} />
        <Route path="/read" />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
      </Routes>
    </Router>
  )
}
