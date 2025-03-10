import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "../../axiosConfig";
import { message } from "antd";

const BasicInfo = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [acts, setActs] = useState([]);
  const [otherActivity, setOtherActivity] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get('getAllActivityNotCustum')
      .then(response => {
        setActs(response.data);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
      });
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedYear) {
  //     message.error("Veuillez sélectionner une année.");
  //     return;
  //   }

  //   let activityId = selectedActivity;

  //   setLoading(true);

  //   try {
  //     // Si l'utilisateur a sélectionné "Autre activité", créer d'abord l'activité
  //     if (selectedActivity === "Autre activité") {
  //       if (!otherActivity) {
  //         message.error("Veuillez spécifier l'autre activité.");
  //         setLoading(false);
  //         return;
  //       }

  //       const activityResponse = await axiosInstance.post("/CreateActivityByLabo", {
  //         name: otherActivity
  //       });

  //       activityId = activityResponse.data.activity.id;
  //       message.success("Nouvelle activité créée avec succès.");
  //     }

  //     // Appel API pour créer ActivityByLabo
  //     await axiosInstance.post("/CreateActivityByLabo", {
  //       year: format(selectedYear, "yyyy"),
  //       laboId: 1, // Remplacer par l'ID réel du laboratoire
  //       ActivityId: activityId
  //     });

  //     message.success("Activité créée avec succès !");
  //   } catch (error) {
  //     console.error("Erreur lors de la création de l'activité:", error);
  //     message.error(error.response?.data?.message || "Erreur lors de la création.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// Remplacer la fonction handleSubmit par celle-ci
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedYear) {
    message.error("Veuillez sélectionner une année.");
    return;
  }

  if (selectedActivity === "Autre activité" && !otherActivity) {
    message.error("Veuillez spécifier l'autre activité.");
    return;
  }

  setLoading(true);

  try {
    // Un seul appel API qui gère à la fois l'activité standard et personnalisée
    await axiosInstance.post("/CreateActivityByLabo", {
      year: parseInt(format(selectedYear, "yyyy")),
      laboId: 1, // Remplacer par l'ID réel du laboratoire
      ActivityId: selectedActivity,
      otherActivity: selectedActivity === "Autre activité" ? otherActivity : null
    });

    message.success("Activité créée avec succès !");
    
    // Réinitialiser le formulaire après succès
    setSelectedActivity("");
    setOtherActivity("");
    setSelectedYear(undefined);
  } catch (error) {
    console.error("Erreur lors de la création de l'activité:", error);
    message.error(error.response?.data?.message || "Erreur lors de la création.");
  } finally {
    setLoading(false);
  }
};
  
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Informations de base</CardTitle>
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
                    <SelectItem key={activity.id} value={activity.id}>
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
                    showMonthYearPicker={false}
                    view="year"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? "En cours..." : "Créer l'activité"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfo;
