import { useState } from "react";
import { signUpUser } from "../../lib/common";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      const data = await signUpUser({ email, password });
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
    <div className="signUp-form-container">
      <h1>Inscription</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <input
        className={`confirm-password ${
          confirmPassword && password !== confirmPassword ? "error" : ""
        }`}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmer le mot de passe"
      />
      {confirmPassword && password !== confirmPassword && (
        <p className="password-error">Les mots de passe ne correspondent pas</p>
      )}
      {error && <p>{error}</p>}
      <div className="button-container">
        <button
          className="signup-button"
          onClick={handleSignUp}
          disabled={password !== confirmPassword || !password}
        >
          S'inscrire
        </button>
        <fieldset className="separator">
          <legend>ou</legend>
        </fieldset>
        <button className="login-button" onClick={() => navigate("/login")}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default SignUp;
