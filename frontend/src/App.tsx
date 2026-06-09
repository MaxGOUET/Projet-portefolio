import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil/Accueil";
import Login from "./pages/Login/Login";
import BackOffice from "./pages/backoffice/Backoffice";
import Chargement from "./pages/Loading/Loading";
import SignUp from "./pages/SignUp/SignUp";
import Profil from "./pages/backoffice/Profil/Profil";
import RemoveProject from "./pages/backoffice/RemoveProject/RemoveProject";
import ModifyProject from "./pages/backoffice/ModifyProject/ModifyProject";
import ModifyProjectId from "./pages/backoffice/ModifyProject/ModifyProjectId";
import AddProject from "./pages/backoffice/AddProject/AddProject";
import Project from "./pages/Project/Project";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/login" element={<Login />} />
        <Route path="/backoffice" element={<BackOffice />}>
          <Route path="add-project" element={<AddProject />} />
          <Route path="modify-project" element={<ModifyProject />}>
            <Route
              path="modify-project/:projectId"
              element={<ModifyProjectId />}
            />
          </Route>

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
