import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authenticated from "./pages/Accueil/accueil";
import Login from "./pages/login/login";
import BackOffice from "./pages/backoffice/backoffice";
import Chargement from "./pages/Chargement/Chargement";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authenticated />} />
        <Route path="/login" element={<Login />} />
        <Route path="/backoffice" element={<BackOffice />} />
        <Route path="/loading" element={<Chargement />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
