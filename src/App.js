// App.js sin <Router>
import "./App.css";
import FlatDetail from "./components/FlatDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import CreateProperty from "./components/CreateProperty";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Modal from "react-modal";
import AdminUpload from "../src/firebase/AdminUpload";

import RequireAdmin from "./components/RequireAdmin";
import EditPropiedad from "./components/EditPropiedad";

function App() {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/create" element={<CreateProperty />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/editar-propiedad/:id" element={<EditPropiedad />} /> {/* ✅ nueva ruta */}
        <Route path="/flat/:slug" element={<FlatDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminUpload />
            </RequireAdmin>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
