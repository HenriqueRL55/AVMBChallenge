import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../../services/auth";

export const LoginPage = () => {
  const { signIn, signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  return (
    <div>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={() => signIn(email, password)}>Entrar</button>
      <button onClick={signInWithGoogle}>Entrar com Google</button>
    </div>
  );
};
