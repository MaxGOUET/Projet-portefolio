import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil/accueil";
import Login from "./pages/login/login";
import BackOffice from "./pages/backoffice/backoffice";
import Chargement from "./pages/Chargement/Chargement";
import SignUp from "./pages/SignUp/SignUp";
import Profil from "./pages/backoffice/Profil/Profil";
import RemoveProject from "./pages/backoffice/RemoveProject/RemoveProject";
import ModifyProject from "./pages/backoffice/ModifyProject/ModifyProject";
import AddProject from "./pages/backoffice/AddProject/AddProject";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/backoffice" element={<BackOffice />}>
          <Route path="add-project" element={<AddProject />} />
          <Route path="modify-project" element={<ModifyProject />} />
          <Route path="remove-project" element={<RemoveProject />} />
          <Route path="profil" element={<Profil />} />
        </Route>
        <Route path="/loading" element={<Chargement />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
