import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import ProfileEditPage from "./pages/ProfileEditPage";

export default function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mylibrary" element={<LibraryPage />} />
        <Route path="/reader/:bookId" element={<ReaderPage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
      </Routes>
    </Router>
  )
}
