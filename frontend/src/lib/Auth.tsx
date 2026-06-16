import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser } from "./common";
import Loading from "../pages/Loading/Loading";

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
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
    return <Loading />;
  }

  if (authenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

export default AuthenticatedRoute;
