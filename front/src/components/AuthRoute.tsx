import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; // Ajuste le chemin
import { ca } from "date-fns/locale";
import {message} from "antd";

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
        } else {
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

export const ActRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false); // État pour gérer l'accès

  useEffect(() => {
    const checkActivityAccess = async () => {
      try {
        const response = await axiosInstance.get("/auth/checkActivity");
        if (response.data.authorised == false) {
          message.error("Vous n'êtes pas habilité à accéder à cette activité");
          navigate("/Home");
        } else if (response.data.authorised === true) {
          // const pat = response.data.activityNumber;
          message.success("Vous êtes bien autorisé");
          setAccessGranted(true); 
          // navigate(/CalculateAct${pat});
        }else {
          message.error("Acune reponse d'autorisation");
          navigate("/Home");
        }
      } catch (error) {
        message.error("Erreur de vérification");
        navigate("/Home");
      } finally {
        setLoading(false);
      }
    };

    checkActivityAccess();
  }, [navigate]);

  // Si la vérification est en cours, afficher le composant de chargement
  if (loading) {
    return (
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
  }

  // Si l'accès est autorisé, afficher le composant enfant
  return accessGranted ? children : null;
};


export const CalcRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkCalculatedStatus = async () => {
      try {
        const response = await axiosInstance.get("/auth/checkCalculated");
        if (response.data.authorised == true) {
          setIsAuthorized(true);
          navigate("/RoiResultCard");
          message.success("Active bien trouve");


        } else if(response.data.authorised == false) {
          navigate("/DisplayCalculatedActivity");
          message.error("Activite non calcule");
        }
      } catch (error) {
        navigate("/DisplayCalculatedActivity");
        message.error("Errror de navigation reseyer plus tard");

      } finally {
        setLoading(false);
      }
    };

    checkCalculatedStatus();
  }, [navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  // Render children only if the user is authorized
  return isAuthorized ? children : null;
};


// export const CalcRoute = ({children}) =>{
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [checkCalculated, setCheckCalculated] = useState(false);
//   const location = useLocation();
//   useEffect(() => {
//     const checkckalc = async () => {
//       try {
//         const response = await axiosInstance.get("/auth/checkCalculated");
//         if (
//           response.data.authorised === true 
//         ) {
//           setCheckCalculated(true);
//         } else {
//           navigate("/RoiResultCard");
//         }
//       } catch (error) {
//         navigate("/DisplayCalculatedActivity");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkckalc();
//   }, [navigate]);
//   if (loading) {
//     return <LoadingComponent />;
//   }

//   return checkCalculated ? children : null;
// };