import './App.css';
import {BrowserRouter, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
      <BrowserRouter>
        <Navbar>
          <div className="content">
            <Routes>

            </Routes>
          </div>
        </Navbar>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
