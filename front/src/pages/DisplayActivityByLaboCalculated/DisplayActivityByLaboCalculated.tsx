
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
import {
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TheHeader from "../Header/Header";
import Head from "../../components/Head";

const { Option } = Select;

const storeActivityIdInCookie = (id: number) => {
  document.cookie = `activityId=${id}; path=/; max-age=3600;`;
};

const DisplayActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string | null>(null);
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    deleteCookie("activityId");
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

  useEffect(() => {
    let filtered = [...activities];

    if (selectedYearFilter) {
      filtered = filtered.filter(
        (activity) => activity.year === parseInt(selectedYearFilter)
      );
    }

    if (selectedActivityFilter) {
      filtered = filtered.filter(
        (activity) => activity.Name === selectedActivityFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((activity) =>
        activity.Name.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Zone de filtres */}
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
          {[...new Set(activities.map((a) => a.year))].map((year) => (
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
          {[...new Set(activities.map((a) => a.Name))].map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>

        <Button onClick={resetFilters}>Réinitialiser</Button>
      </div>

      {/* Affichage des activités */}
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
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
                  </CardContent>
                </span>
                <span >
                  <Link to="/RoiResultCard" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      // onClick={() => storeActivityIdInCookie(activity.id)}
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

      {/* Footer */}
      <CardFooter className="flex justify-between items-center mt-10">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeftOutlined className="mr-2" />
          Retour à l'accueil
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={deleteLabovalues}
          >
            <DeleteOutlined className="mr-2" />
            Mettre à 0
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};

export default DisplayActivity;
