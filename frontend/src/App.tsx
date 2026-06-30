import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil/Accueil";
import Login from "./pages/Login/Login";
import BackOffice from "./pages/backoffice/Backoffice";
import Chargement from "./pages/Loading/Loading";
import SignUp from "./pages/SignUp/SignUp";
// import Profil from "./pages/backoffice/Profil/Profil";
import RemoveProject from "./pages/backoffice/RemoveProject/RemoveProject";
import ModifyProject from "./pages/backoffice/ModifyProject/ModifyProject";
import ModifyProjectId from "./pages/backoffice/ModifyProjectId/ModifyProjectId";
import AddProject from "./pages/backoffice/AddProject/AddProject";
import Project from "./pages/Project/Project";
import Header from "./components/Header/Header";
import NotFound from "./pages/404/404";
import AuthenticatedRoute from "./lib/Auth";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/backoffice"
          element={
            <AuthenticatedRoute>
              <BackOffice />
            </AuthenticatedRoute>
          }
        >
          <Route
            path="add-project"
            element={
              <AuthenticatedRoute>
                <AddProject />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="modify-project"
            element={
              <AuthenticatedRoute>
                <ModifyProject />
              </AuthenticatedRoute>
            }
          >
            <Route
              path=":projectId"
              element={
                <AuthenticatedRoute>
                  <ModifyProjectId />
                </AuthenticatedRoute>
              }
            />
          </Route>

          <Route
            path="remove-project"
            element={
              <AuthenticatedRoute>
                <RemoveProject />
              </AuthenticatedRoute>
            }
          />
          {/* <Route
            path="profil"
            element={
              <AuthenticatedRoute>
                <Profil />
              </AuthenticatedRoute>
            }
          /> */}
        </Route>

        <Route path="/loading" element={<Chargement />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
