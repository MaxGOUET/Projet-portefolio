import "./backoffice.scss";
import "../../index.css";
import NavBackOffice from "../../components/NavBackOffice/NavBackOffice";
import { useState } from "react";
import AddProject from "./AddProject/AddProject";
import ModifyProject from "./ModifyProject/ModifyProject";
import RemoveProject from "./RemoveProject/RemoveProject";
import Profil from "./Profil/Profil";

function BackOffice() {
  const [selected, setSelected] = useState("");

  return (
    <div>
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
}

export default BackOffice;
