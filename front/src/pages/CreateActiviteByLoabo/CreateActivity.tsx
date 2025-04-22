import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, LogOut } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { message, Layout, Typography } from "antd";

import axiosInstance from "../../axiosConfig";
import Head from "../Header/Header";

const { Header, Content } = Layout;
const { Title } = Typography;

const CreateActivity = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [acts, setActs] = useState([]);
  const [otherActivity, setOtherActivity] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("getAllActivityNotCustum")
      .then((response) => {
        setActs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedYear) {
      message.error("Veuillez sélectionner une année.");
      return;
    }
    if (selectedActivity === "Autre activité" && !otherActivity.trim()) {
      message.error("Veuillez spécifier l'autre activité.");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/CreateActivityByLabo", {
        year: parseInt(format(selectedYear, "yyyy")),
        ActivityId: selectedActivity,
        otherActivity:
          selectedActivity === "Autre activité" ? otherActivity.trim() : null,
      });
      const successMsg =
        response.data?.message || "Activité créée avec succès !";
      message.success(successMsg);
      setSelectedActivity("");
      setOtherActivity("");
      setSelectedYear(undefined);
    } catch (error: any) {
      console.error("Erreur lors de la création de l'activité:", error);
      const errMsg =
        error.response?.data?.message || "Erreur lors de la création.";
      message.error(errMsg);
      if (error.response?.status === 409) {
        setSelectedActivity("");
        setOtherActivity("");
        setSelectedYear(undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Head />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div className="container mx-auto py-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="activity">Nom de l'activité</Label>
                  <Select
                    value={selectedActivity}
                    onValueChange={setSelectedActivity}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une activité" />
                    </SelectTrigger>
                    <SelectContent>
                      {acts.map((activity) => (
                        <SelectItem key={activity.id} value={activity.Name}>
                          {activity.Name}
                        </SelectItem>
                      ))}
                      <SelectItem key="Autre activité" value="Autre activité">
                        Autre activité
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedActivity === "Autre activité" && (
                  <div className="space-y-2">
                    <Label htmlFor="otherActivity">Précisez l'activité</Label>
                    <Input
                      id="otherActivity"
                      placeholder="Entrez le nom de votre activité"
                      value={otherActivity}
                      onChange={(e) => setOtherActivity(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="year"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedYear && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedYear ? (
                          format(selectedYear, "yyyy")
                        ) : (
                          <span>Sélectionnez une année</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedYear}
                        onSelect={setSelectedYear}
                        initialFocus
                        className="pointer-events-auto"
                        locale={fr}
                        captionLayout="dropdown-buttons"
                        fromYear={1990}
                        toYear={2050}
                        view="year"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? "En cours..." : "Créer l'activité"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};
export default CreateActivity;
