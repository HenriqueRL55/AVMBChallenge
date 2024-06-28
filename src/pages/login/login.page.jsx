import React, { useContext } from "react";
import { AuthContext } from "./Auth";

export const LoginPage = () => {
  const { email, setEmail, password, setPassword, signIn, signInWithGoogle, logout } = useContext(AuthContext);

  return (
    <div>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={signIn}> Entrar </button>
      <button onClick={signInWithGoogle}> Entrar com Google</button>
      <button onClick={logout}> Sair </button>
    </div>
  );
};
