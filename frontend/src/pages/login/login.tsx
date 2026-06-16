import { loginUser } from "../../lib/common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email, password });
      if (data.error) {
        setError(data.error);
      } else {
        navigate("/backoffice");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="login-container">
        <h1>Connexion</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        {error && <p>{error}</p>}
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
            Se connecter
          </button>
          <fieldset className="separator">
            <legend>ou</legend>
          </fieldset>
          <button className="signup-button" onClick={() => navigate("/signup")}>
            S'inscrire
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
