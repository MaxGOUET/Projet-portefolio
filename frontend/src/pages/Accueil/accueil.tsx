import { useEffect, useState } from "react";
import { getAuthUser } from "../../lib/common";
import Chargement from "../Chargement/Chargement";
import BackOffice from "../backoffice/backoffice";
import Login from "../login/login";

function Authenticated() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    return <Chargement />;
  }

  if (authenticated) {
    return <BackOffice />;
  } else {
    return <Login />;
  }
}

export default Authenticated;
