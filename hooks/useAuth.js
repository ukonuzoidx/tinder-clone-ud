import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Google from "expo-google-app-auth";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({
  //initial state...
});

const config = {
  androidClientId:
    "548672300919-m9599lohsq2b1av3ujll2slv21t3gtr9.apps.googleusercontent.com",
  iosClientId:
    "548672300919-qko6q1rv28s0tsc9lbbonvps810g5epi.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //logged in
          setUser(user);
        } else {
          setUser(null);
        }

        setLoadingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };
  const signInWithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === "success") {
          //login ...
          const { idToken, accessToken } = logInResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );

          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const memomedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memomedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
