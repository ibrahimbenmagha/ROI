// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import { Button, message, Select, Input } from "antd";
// import { Skeleton } from "@/components/ui/skeleton";
// import axiosInstance, { deleteCookie } from "../../axiosConfig";
// import TheHeader from "../Header/Header";
// import Head from "../../components/Head";

// const { Option } = Select;

// const storeActivityIdInCookie = (id, activityId) => {
//   document.cookie = `activityId=${id}; path=/; max-age=3600;`;
//   document.cookie = `activityNumber=${activityId}; path=/; max-age=3600;`;
// };

// const DisplayActivity = () => {
//   const [activities, setActivities] = useState([]);
//   const [filteredActivities, setFilteredActivities] = useState([]);
//   const [allActivityOptions, setAllActivityOptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterBy, setFilterBy] = useState(null);
//   const [sortBy, setSortBy] = useState(null);

//   // Get all activities
//   const fetchActivities = () => {
//     setLoading(true);
//     axiosInstance
//       .get("getAllActivityByLaboInfosByLaboId")
//       .then((response) => {
//         setActivities(response.data);
//         setFilteredActivities(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching activities:", error);
//         setError("Échec du chargement des activités");
//         setLoading(false);
//       });
//   };

//   // Get filter options
//   useEffect(() => {
//     axiosInstance
//       .get("getAllActivityNotCustum")
//       .then((response) => {
//         setAllActivityOptions(response.data); // id + Name
//       })
//       .catch((error) => {
//         console.error("Error fetching activities:", error);
//       });
//   }, []);

//   useEffect(() => {
//     deleteCookie("activityId");
//     deleteCookie("activityNumber");
//     fetchActivities(); // chargement initial
//   }, []);

//   // Filtering, sorting, searching
//   useEffect(() => {
//     let updated = [...activities];

//     if (filterBy) {
//       updated = updated.filter((activity) => activity.ActivityId === filterBy);
//     }

//     if (searchTerm) {
//       updated = updated.filter((activity) =>
//         activity.Name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortBy === "name") {
//       updated.sort((a, b) => a.Name.localeCompare(b.Name));
//     } else if (sortBy === "year") {
//       updated.sort((a, b) => b.year - a.year);
//     }

//     setFilteredActivities(updated);
//   }, [searchTerm, filterBy, sortBy, activities]);

//   const handleDelete = async (id, activityId) => {
//     storeActivityIdInCookie(id, activityId);
//     const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer les données ?");
//     if (!confirmDelete) return;

//     try {
//       const response = await axiosInstance.delete("/deleteLaboNotCalculatedById");
//       message.success(response.data.message || "Les données ont été supprimées avec succès");
//       fetchActivities(); // recharge la liste après suppression
//     } catch (error) {
//       console.error("Erreur lors de la suppression des données:", error);
//       message.error("Erreur lors de la suppression des données");
//     }
//   };

//   const styles = {
//     cardWrapper: {
//       display: "flex",
//       flexDirection: "row",
//     },
//     buttonColumn: {
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       width: "52%",
//       paddingRight: "10px",
//       gap: "10px",
//     },
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <TheHeader />
//       <Head title="Activités par laboratoire" subtitle="" />

//       {/* Barre de filtre / recherche / tri */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <Input
//           placeholder="Rechercher une activité"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ maxWidth: 250 }}
//         />

//         <Select
//           placeholder="Filtrer par activité"
//           allowClear
//           style={{ width: 250 }}
//           onChange={(value) => setFilterBy(value)}
//         >
//           {allActivityOptions.map((act) => (
//             <Option key={act.id} value={act.id}>
//               {act.Name}
//             </Option>
//           ))}
//         </Select>

//         <Select
//           placeholder="Trier par"
//           style={{ width: 180 }}
//           onChange={(value) => setSortBy(value)}
//           allowClear
//         >
//           <Option value="name">Nom</Option>
//           <Option value="year">Année</Option>
//         </Select>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform scale-150 transition-transform">
//           {[...Array(6)].map((_, index) => (
//             <Card key={index} style={styles.cardWrapper} className="shadow-md hover:shadow-lg">
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
//                 className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                 style={styles.cardWrapper}
//               >
//                 <span style={{ width: "60%" }}>
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold">{activity.Name}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Laboratoire:</span> {activity.LaboName}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Année:</span> {activity.year}
//                     </p>
//                   </CardContent>
//                 </span>

//                 <span style={styles.buttonColumn}>
//                   <Link to={`/CalculateAct${activity.ActivityId}`} style={{ width: "50%" }}>
//                     <Button
//                       type="primary"
//                       style={{ width: "100%" }}
//                       onClick={() =>
//                         storeActivityIdInCookie(activity.id, activity.ActivityId)
//                       }
//                     >
//                       Calculer
//                     </Button>
//                   </Link>

//                   <Button
//                     danger
//                     style={{ width: "50%" }}
//                     onClick={() => handleDelete(activity.id, activity.ActivityId)}
//                   >
//                     Supprimer
//                   </Button>
//                 </span>
//               </Card>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisplayActivity;


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button, message, Select, Input, Space } from "antd";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";
import Head from "../../components/Head";

const { Option } = Select;

const storeActivityIdInCookie = (id, activityId) => {
  document.cookie = `activityId=${id}; path=/; max-age=3600;`;
  document.cookie = `activityNumber=${activityId}; path=/; max-age=3600;`;
};

const DisplayActivity = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [allActivityOptions, setAllActivityOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres & recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByName, setFilterByName] = useState(null);
  const [filterByYear, setFilterByYear] = useState("");
  const [sortBy, setSortBy] = useState(null);

  // Récupération des activités
  const fetchActivities = () => {
    setLoading(true);
    axiosInstance
      .get("getAllActivityByLaboInfosByLaboId")
      .then((response) => {
        setActivities(response.data);
        setFilteredActivities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError("Échec du chargement des activités");
        setLoading(false);
      });
  };

  // Récupération des noms pour filtre
  useEffect(() => {
    axiosInstance
      .get("getAllActivityNotCustum")
      .then((response) => {
        setAllActivityOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  // Chargement initial
  useEffect(() => {
    deleteCookie("activityId");
    deleteCookie("activityNumber");
    fetchActivities();
  }, []);

  // Appliquer les filtres / tri / recherche
  useEffect(() => {
    let updated = [...activities];

    if (filterByName) {
      updated = updated.filter((activity) => activity.ActivityId === filterByName);
    }

    if (filterByYear) {
      updated = updated.filter(
        (activity) => activity.year.toString() === filterByYear.toString()
      );
    }

    if (searchTerm) {
      updated = updated.filter((activity) =>
        activity.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      updated.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortBy === "year") {
      updated.sort((a, b) => b.year - a.year);
    }

    setFilteredActivities(updated);
  }, [searchTerm, filterByName, filterByYear, sortBy, activities]);

  const handleDelete = async (id, activityId) => {
    storeActivityIdInCookie(id, activityId);
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer les données ?");
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete("/deleteLaboNotCalculatedById");
      message.success(response.data.message || "Les données ont été supprimées avec succès");
      fetchActivities(); // recharge la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Erreur lors de la suppression des données");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterByName(null);
    setFilterByYear("");
    setSortBy(null);
  };

  const styles = {
    cardWrapper: {
      display: "flex",
      flexDirection: "row",
    },
    buttonColumn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "52%",
      paddingRight: "10px",
      gap: "10px",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TheHeader />
      <Head title="Activités par laboratoire" subtitle="" />

      {/* Barre des filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
        <Input
          placeholder="Rechercher une activité"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 200 }}
        />

        <Select
          placeholder="Filtrer par activité"
          allowClear
          style={{ width: 200 }}
          value={filterByName}
          onChange={(value) => setFilterByName(value)}
        >
          {allActivityOptions.map((act) => (
            <Option key={act.id} value={act.id}>
              {act.Name}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Filtrer par année"
          type="number"
          maxLength={4}
          value={filterByYear}
          onChange={(e) => setFilterByYear(e.target.value)}
          style={{ maxWidth: 140 }}
        />

        <Select
          placeholder="Trier par"
          style={{ width: 160 }}
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          allowClear
        >
          <Option value="name">Nom</Option>
          <Option value="year">Année</Option>
        </Select>

        <Button onClick={resetFilters} type="default">
          Réinitialiser les filtres
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loader ou Activités */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform scale-150 transition-transform">
          {[...Array(6)].map((_, index) => (
            <Card key={index} style={styles.cardWrapper} className="shadow-md hover:shadow-lg">
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
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                style={styles.cardWrapper}
              >
                <span style={{ width: "60%" }}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{activity.Name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      <span className="font-semibold">Laboratoire:</span> {activity.LaboName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Année:</span> {activity.year}
                    </p>
                  </CardContent>
                </span>

                <span style={styles.buttonColumn}>
                  <Link to={`/CalculateAct${activity.ActivityId}`} style={{ width: "50%" }}>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={() =>
                        storeActivityIdInCookie(activity.id, activity.ActivityId)
                      }
                    >
                      Calculer
                    </Button>
                  </Link>

                  <Button
                    danger
                    style={{ width: "50%" }}
                    onClick={() => handleDelete(activity.id, activity.ActivityId)}
                  >
                    Supprimer
                  </Button>
                </span>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayActivity;
