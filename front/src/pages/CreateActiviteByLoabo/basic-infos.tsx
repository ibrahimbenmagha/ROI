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
const BasicInfo = () => {
    const [selectedActivity, setSelectedActivity] = useState<string>("");
    const [acts, setActs] = useState([]);
    const [otherActivity, setOtherActivity] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

  const activities = [
    "Sport",
    "Musique",
    "Art",
    "Cuisine",
    "Jardinage",
    "Photographie",
    "Danse",
    "Autre activité"
  ];
  
  useEffect(() => {
    axiosInstance.get('getAllActivityNotCustum')
      .then(response => {
        setActs(response.data);
      })
      .catch(error => {
        console.error('Error fetching specialities:', error);
      });
  }, []);


  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Informations de base</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
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

            <Button type="submit" className="w-full">
            Creer l'activite
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfo;
