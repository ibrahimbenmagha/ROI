import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; // Ajuste le chemin

// Composant de chargement pendant la vérification
const LoadingComponent = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  > 
    Chargement...
  </div>
);

// Route protégée pour les utilisateurs avec le rôle "Laboratoire"
export const LaboRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/check");
        if (
          response.data.authenticated &&
          response.data.role === "Laboratoire"
        ) {
          setAuthenticated(true);
        } else {
          navigate("/Home");
        }
      } catch (error) {
        navigate("/Login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  return authenticated ? children : null;
};

// Route protégée pour les utilisateurs avec le rôle "Admin"
export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/check");
        if (response.data.authenticated && response.data.role === "Admin") {
          setAuthenticated(true);
        } else {
          navigate("/DashboardLogin");
        }
      } catch (error) {
        navigate("/DashboardLogin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  return authenticated ? children : null;
};

// Route d'authentification qui redirige les utilisateurs déjà connectés
export const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/check");
        if (response.data.authenticated) {
          const role = response.data.role;
          if (role === "Laboratoire") {
            navigate("/Home");
          } else if (role === "Admin") {
            navigate("/Dashboard");
          }
          // setShouldRedirect(true);
        }else{
          navigate("/Login");
        }
      } catch (error) {
        // Erreur d'API, on suppose que l'utilisateur n'est pas authentifié
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  return !shouldRedirect ? children : null;
};
