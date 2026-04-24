import './App.css';
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {AppRoutes} from "./routes/AppRoutes";

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <AppRoutes />
        </div>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
