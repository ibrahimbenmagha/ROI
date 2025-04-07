import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "../../axiosConfig";
import {deleteCookie } from "../../axiosConfig";

import TheHeader from "../Header/Header";
import Head from "../../components/Head";

const storeActivityIdInCookie = (id) => {
  document.cookie = `activityId=${id}; path=/; max-age=3600;`;
};

const DisplayActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    deleteCookie("activityId");

    axiosInstance
      .get("getAllCalculatedActivityByLaboInfosByLaboId")
      //getAllCalculatedActivityByLaboInfosByLaboId
      .then((response) => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities");
        setLoading(false);
      });
  }, []);

  const styles = {
    md: {
      display: "flex",
      flexDirection: "row",
    },
    ButtonSpan: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40%",
      paddingRight: "10px",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TheHeader />
      <Head title="Activités par laboratoire" subtitle="" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
          {activities.length === 0 ? (
            <div>No activities available</div>
          ) : (
            activities.map((activity) => (
              <Card
                key={activity.id}
                className="md shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                style={styles.md}
              >
                <span style={{ width: "60%" }}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {activity.Name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      <span className="font-semibold">Laboratoire:</span>{" "}
                      {activity.LaboName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Année:</span>{" "}
                      {activity.year}
                    </p>

                    <span className="text-gray-600"></span>
                  </CardContent>
                </span>
                <span style={styles.ButtonSpan}>
                  <Link
                    to='/RoiResultCard'
                    style={{ width: "100%" }}
                  >
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={() => storeActivityIdInCookie(activity.id)}
                    >
                      Calculer
                    </Button>
                  </Link>
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
