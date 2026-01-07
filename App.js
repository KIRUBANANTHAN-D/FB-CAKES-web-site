import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import CakeDetails from "./pages/CakeDetails";

function App() {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/cakes/")
      .then(res => setCakes(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu cakes={cakes} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cake/:id" element={<CakeDetails cakes={cakes} />} />
      </Routes>
    </Router>
  );
}

export default App;

