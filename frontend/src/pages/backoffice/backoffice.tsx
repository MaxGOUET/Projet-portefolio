import Header from "../../components/Header/Header";
import "./backoffice.scss";
import "../../index.css";
import NavBackOffice from "../../components/NavBackOffice/NavBackOffice";
import { getAuthUser } from "../../lib/common";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddProject from "./AddProject/AddProject";
import ModifyProject from "./ModifyProject/ModifyProject";
import RemoveProject from "./RemoveProject/RemoveProject";
import Profil from "./Profil/Profil";
import Loading from "../Loading/Loading";
function BackOffice() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    getAuthUser().then((data) => {
      if (data.authenticated === true) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (authenticated) {
    return (
      <div>
        <Header />
        <div className="back-office-container">
          <NavBackOffice onSelect={setSelected} />
          <div className="content">
            {selected === "add-project" && <AddProject />}
            {selected === "modify-project" && <ModifyProject />}
            {selected === "remove-project" && <RemoveProject />}
            {selected === "profil" && <Profil />}
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default BackOffice;
