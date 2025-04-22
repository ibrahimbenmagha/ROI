import React, { useState, useEffect } from "react";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Head from "../Header/Header";

interface Activity {
  id: string;
  Name: string;
  description?: string;
}

interface CalculatedActivity {
  id: string;
  activityId: string;
  date: string;
  actName?: string;
  details?: string;
}

// ✅ Function to store activity IDs in cookies
const storeActivityIdInCookie = (id: string, activityId: string) => {
  if (id === "autre") {
    document.cookie = `activityNumber=Autre activité; path=/; max-age=3600;`;
  } else {
    document.cookie = `activityNumber=${activityId}; path=/; max-age=3600;`;
  }
};

const storeActivityIdInCookie2 = (id: number) => {
  document.cookie = `activityId=${id}; path=/; max-age=3600;`;
};

const ActivityPage: React.FC = () => {
  const [acts, setActs] = useState<Activity[]>([]);
  const [activities, setActivities] = useState<CalculatedActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    deleteCookie("activityNumber");
    axiosInstance
      .get("getAllActivityNotCustum")
      .then((response) => {
        const baseActs = response.data;
        const other = {
          id: "autre",
          Name: "Autre activité",
        };
        setActs([...baseActs, other]);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get("getAllCalculatedActivityByLaboInfosByLaboId")
      .then((response) => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError("Échec du chargement des activités");
        setLoading(false);
      });
  }, []);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  
  return (
    <div>
      <Head />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Partie gauche - Liste des activités */}
        <div className="w-full md:w-2/3 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">
              Liste des activités
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {acts.map((act) => (
                <div
                  key={act.id}
                  className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
                    selectedActivity?.id === act.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => handleActivityClick(act)}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">
                      {act.Name}
                    </h3>
                    <div className="flex justify-end mt-4">
                      <Link
                        to={
                          act.id === "autre"
                            ? "/AddCustomActivity"
                            : `/CalculateAct${act.id}`
                        }
                      >
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            storeActivityIdInCookie(act.id, act.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Calculer
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partie droite - Historique */}
        <div className="w-full md:w-1/3 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Historique
            </h1>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Vous n'avez aucun historique</p>
              </div>
            ) : (
              <div className="space-y-4 mt-5">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">
                        {(activity as any).actName || "Activité sans nom"}
                      </p>
                      <span className="text-xs text-gray-500">
                        {`Année: ${(activity as any).year}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Rendement sur l'investisement{" "}
                      {activity.details || "Aucun détail disponible"}
                    </p>

                    <div className="flex justify-end mt-3">
                      <Link to="/RoiResultCard">
                        <Button type="primary" size="small" className="text-xs"
                      onClick={() => storeActivityIdInCookie(activity.id, activity.id)}
                      >
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
