// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Link, useNavigate } from "react-router-dom";
// import { Button, Input, Select, message, Skeleton } from "antd";
// import axiosInstance, { deleteCookie } from "../../axiosConfig";
// import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
// import TheHeader from "../Header/Header";
// import Head from "../../components/Head";

// const { Option } = Select;

// const storeActivityIdInCookie = (id: number) => {
//   document.cookie = `activityNumber=${id}; path=/; max-age=3600;`;
//   document.cookie = `activityId=${id}; path=/; max-age=3600;`;
  
// };

// const DisplayActivity = () => {
//   const [activities, setActivities] = useState<any[]>([]);
//   const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedYearFilter, setSelectedYearFilter] = useState<string | null>(
//     null
//   );
//   const [selectedActivityFilter, setSelectedActivityFilter] = useState<
//     string | null
//   >(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     deleteCookie("activityId");
//     axiosInstance
//       .get("getAllCalculatedActivityByLaboInfosByLaboId")
//       .then((response) => {
//         if (response.status === 204) {
//           setActivities([]);
//           setLoading(false);
//           return;
//         }

//         if (Array.isArray(response.data)) {
//           setActivities(response.data);
//         } else {
//           setError("Format de données inattendu depuis le serveur.");
//         }

//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Erreur de récupération des activités :", error);
//         setError("Échec du chargement des activités");
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     let filtered = Array.isArray(activities) ? [...activities] : [];

//     if (selectedYearFilter) {
//       filtered = filtered.filter(
//         (activity) => activity.year === parseInt(selectedYearFilter)
//       );
//     }

//     if (selectedActivityFilter) {
//       filtered = filtered.filter(
//         (activity) => activity.actName === selectedActivityFilter
//       );
//     }

//     if (searchTerm) {
//       filtered = filtered.filter((activity) =>
//         activity.actName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredActivities(filtered);
//   }, [activities, searchTerm, selectedYearFilter, selectedActivityFilter]);

//   const deleteLabovalues = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const confirmDelete = window.confirm(
//       "Êtes-vous sûr de vouloir supprimer les données ?"
//     );
//     if (confirmDelete) {
//       try {
//         const response = await axiosInstance.delete("/deletelabovalues");
//         message.success(
//           response.data.message || "Les données ont été supprimées avec succès"
//         );
//         navigate("/Home");
//       } catch (error) {
//         console.error("Erreur lors de la suppression des données:", error);
//         message.error("Erreur lors de la suppression des données");
//       }
//     } else {
//       alert("La suppression des données a été annulée");
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedYearFilter(null);
//     setSelectedActivityFilter(null);
//   };

//   const styles = {
//     md: { display: "flex", flexDirection: "row" },
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Head title="Activités par laboratoire" subtitle="" />

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="mb-6 flex flex-wrap gap-4 items-center">
//         <Input
//           placeholder="Rechercher une activité"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ width: 250 }}
//         />

//         <Select
//           allowClear
//           placeholder="Filtrer par année"
//           value={selectedYearFilter}
//           onChange={(value) => setSelectedYearFilter(value)}
//           style={{ width: 180 }}
//         >
//           {Array.isArray(activities) &&
//             [...new Set(activities.map((a) => a.year))].map((year) => (
//               <Option key={year} value={year.toString()}>
//                 {year}
//               </Option>
//             ))}
//         </Select>

//         <Select
//           allowClear
//           placeholder="Filtrer par activité"
//           value={selectedActivityFilter}
//           onChange={(value) => setSelectedActivityFilter(value)}
//           style={{ width: 200 }}
//         >
//           {Array.isArray(activities) &&
//             [...new Set(activities.map((a) => a.actName))].map((name) => (
//               <Option key={name} value={name}>
//                 {name}
//               </Option>
//             ))}
//         </Select>

//         <Button onClick={resetFilters}>Réinitialiser</Button>
//       </div>

//       {loading ? (
//         <div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           style={{ transition: "transform .2s", transform: "scale(1.5)" }}
//         >
//           {[...Array(6)].map((_, index) => (
//             <Card
//               style={styles.md}
//               key={index}
//               className="shadow-md hover:shadow-lg transition-shadow"
//             >
//               <CardHeader>
//                 <Skeleton className="h-4 w-3/4 mb-2" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-4 w-1/2 mb-2" />
//                 <Skeleton className="h-4 w-1/4" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredActivities.length === 0 ? (
//             <div>Aucune activité disponible</div>
//           ) : (
//             filteredActivities.map((activity) => (
//               <Card
//                 key={activity.id}
//                 className="shadow-md hover:shadow-lg transition-shadow"
//                 style={styles.md}
//               >
//                 {/* Partie gauche de la carte */}
//                 <span style={{ width: "60%" }}>
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold">
//                       {activity.actName}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Année:</span>{" "}
//                       {activity.year}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Détails:</span>{" "}
//                       {activity.details}
//                     </p>
//                   </CardContent>
//                 </span>

//                 <span
//                   style={{
//                     width: "40%",
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     alignItems: "center",
//                     paddingRight: "10px",
//                   }}
//                 >
//                   <Link to="../RoiResultCardAdmin">
//                     <Button
//                       type="primary"
//                       onClick={() => storeActivityIdInCookie(activity.id)}
//                     >
//                       Consulter les détails
//                     </Button>
//                   </Link>
//                 </span>
//               </Card>
//             ))
//           )}
//         </div>
//       )}

//       <CardFooter className="flex justify-between items-center mt-10">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-white"
//         >
//           <ArrowLeftOutlined className="mr-2" />
//           Retour à l'accueil
//         </Button>
//       </CardFooter>
//     </div>
//   );
// };

// export default DisplayActivity;

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select, message, Skeleton } from "antd";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import TheHeader from "../Header/Header";
import Head from "../../components/Head";

const { Option } = Select;

const storeActivityIdInCookie = (id: number) => {
  document.cookie = `activityNumber=${id}; path=/; max-age=3600;`;
  document.cookie = `activityId=${id}; path=/; max-age=3600;`;
};

const DisplayActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string | null>(
    null
  );
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    deleteCookie("activityId");
    axiosInstance
      .get("getAllCalculatedActivityByLaboInfosByLaboId")
      .then((response) => {
        if (response.status === 204) {
          setActivities([]);
          setLoading(false);
          return;
        }

        if (Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          setError("Format de données inattendu depuis le serveur.");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de récupération des activités :", error);
        setError("Échec du chargement des activités");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(activities) ? [...activities] : [];

    if (selectedYearFilter) {
      filtered = filtered.filter(
        (activity) => activity.year === parseInt(selectedYearFilter)
      );
    }

    if (selectedActivityFilter) {
      filtered = filtered.filter(
        (activity) => activity.actName === selectedActivityFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((activity) =>
        activity.actName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedYearFilter, selectedActivityFilter]);

  const deleteLabovalues = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (confirmDelete) {
      try {
        const response = await axiosInstance.delete("/deletelabovalues");
        message.success(
          response.data.message || "Les données ont été supprimées avec succès"
        );
        navigate("/Home");
      } catch (error) {
        console.error("Erreur lors de la suppression des données:", error);
        message.error("Erreur lors de la suppression des données");
      }
    } else {
      alert("La suppression des données a été annulée");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYearFilter(null);
    setSelectedActivityFilter(null);
  };

  const styles = {
    md: { display: "flex", flexDirection: "row" },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head title="Activités par laboratoire" subtitle="" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher une activité"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />

        <Select
          allowClear
          placeholder="Filtrer par année"
          value={selectedYearFilter}
          onChange={(value) => setSelectedYearFilter(value)}
          style={{ width: 180 }}
        >
          {Array.isArray(activities) &&
            [...new Set(activities.map((a) => a.year))].map((year) => (
              <Option key={year} value={year.toString()}>
                {year}
              </Option>
            ))}
        </Select>

        <Select
          allowClear
          placeholder="Filtrer par activité"
          value={selectedActivityFilter}
          onChange={(value) => setSelectedActivityFilter(value)}
          style={{ width: 200 }}
        >
          {Array.isArray(activities) &&
            [...new Set(activities.map((a) => a.actName))].map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
        </Select>

        <Button onClick={resetFilters}>Réinitialiser</Button>
      </div>

      {loading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ transition: "transform .2s", transform: "scale(1.5)" }}
        >
          {[...Array(6)].map((_, index) => (
            <Card
              style={styles.md}
              key={index}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <Skeleton className="h-4 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length === 0 ? (
            <div>Aucune activité disponible</div>
          ) : (
            filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="shadow-md hover:shadow-lg transition-shadow"
                style={styles.md}
              >
                {/* Partie gauche de la carte */}
                <span style={{ width: "60%" }}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {activity.actName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      <span className="font-semibold">Année:</span>{" "}
                      {activity.year}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Détails:</span>{" "}
                      <span
                        style={{
                          color:
                            parseFloat(
                              activity.details?.replace("Roi: ", "")
                            ) >= 1
                              ? "green"
                              : "red",
                        }}
                      >
                        Roi :{" "}
                        {parseFloat(
                          activity.details?.replace("Roi: ", "")
                        ).toFixed(3)}
                      </span>
                    </p>
                  </CardContent>
                </span>

                <span
                  style={{
                    width: "40%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: "10px",
                  }}
                >
                  <Link to="../RoiResultCardAdmin">
                    <Button
                      type="primary"
                      onClick={() => storeActivityIdInCookie(activity.id)}
                    >
                      Consulter les détails
                    </Button>
                  </Link>
                </span>
              </Card>
            ))
          )}
        </div>
      )}

      <CardFooter className="flex justify-between items-center mt-10">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeftOutlined className="mr-2" />
          Retour à l'accueil
        </Button>
      </CardFooter>
    </div>
  );
};

export default DisplayActivity;
