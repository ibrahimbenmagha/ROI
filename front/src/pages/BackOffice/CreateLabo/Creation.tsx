import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button} from "@/components/ui/button" ;
import {Button as BTN} from "antd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Building2 } from "lucide-react";

import axiosInstance from "./../../../axiosConfig";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CreateLabo: React.FC = () => {

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    Name: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.FirstName || !form.LastName || !form.Name || !form.email || !form.password) {
      setMessage({ type: "error", text: "Tous les champs sont obligatoires." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.post("/CreateLabo", form);

      if (response.status === 201) {
        setMessage({ type: "success", text: "Le laboratoire a été créé avec succès !" });
        setForm({ FirstName: "", LastName: "", email: "", password: "", Name: "" });
        setTimeout(() => navigate("/BackOffice/DislayLabos"), 2000); // Redirection après succès
      } else {
        setMessage({ type: "error", text: response.data?.message || "Erreur inconnue." });
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du laboratoire:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Erreur lors de la création." });
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F1F0FB] to-white px-4 py-8">
  //     <Card className="w-full max-w-md shadow-xl border-0">
  //       <CardHeader className="flex flex-col gap-1 items-center">
  //         <Building2 className="mb-2 text-primary w-10 h-10" />
  //         <CardTitle className="text-xl font-bold text-center text-[#7E69AB]">
  //           Créer un laboratoire
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         {message && (
  //           <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
  //             <AlertTitle>{message.type === "error" ? "Erreur" : "Succès"}</AlertTitle>
  //             <AlertDescription>{message.text}</AlertDescription>
  //           </Alert>
  //         )}
  //         <form className="grid gap-5" onSubmit={handleSubmit}>
  //           <div>
  //             <Label htmlFor="FirstName">Prénom</Label>
  //             <Input
  //               required
  //               type="text"
  //               id="FirstName"
  //               name="FirstName"
  //               maxLength={20}
  //               placeholder="Prénom"
  //               value={form.FirstName}
  //               onChange={handleChange}
  //               autoComplete="given-name"
  //             />
  //           </div>
  //           <div>
  //             <Label htmlFor="LastName">Nom</Label>
  //             <Input
  //               required
  //               type="text"
  //               id="LastName"
  //               name="LastName"
  //               maxLength={20}
  //               placeholder="Nom"
  //               value={form.LastName}
  //               onChange={handleChange}
  //               autoComplete="family-name"
  //             />
  //           </div>
  //           <div>
  //             <Label htmlFor="Name">Nom de l'établissement</Label>
  //             <Input
  //               required
  //               type="text"
  //               id="Name"
  //               name="Name"
  //               maxLength={255}
  //               placeholder="Nom du laboratoire"
  //               value={form.Name}
  //               onChange={handleChange}
  //             />
  //           </div>
  //           <div>
  //             <Label htmlFor="email">Adresse email</Label>
  //             <Input
  //               required
  //               type="email"
  //               id="email"
  //               name="email"
  //               maxLength={255}
  //               placeholder="contact@labo.com"
  //               value={form.email}
  //               onChange={handleChange}
  //               autoComplete="email"
  //             />
  //           </div>
  //           <div>
  //             <Label htmlFor="password">Mot de passe</Label>
  //             <Input
  //               required
  //               type="password"
  //               id="password"
  //               name="password"
  //               minLength={6}
  //               placeholder="Mot de passe"
  //               value={form.password}
  //               onChange={handleChange}
  //               autoComplete="new-password"
  //             />
  //           </div>
  //           <Button
  //             type="submit"
  //             disabled={loading}
  //             className="w-full mt-1"
  //           >
  //             {loading ? "Création..." : "Créer le laboratoire"}
  //           </Button>
  //         </form>

  //       </CardContent>
  //       <CardFooter className="flex justify-between items-center mt-10">
  //       <BTN
  //         onClick={() => navigate("../DislayLabos")}
  //         icon={<ArrowLeftOutlined />}
  //       >
  //         Retour à l'accueil
  //       </BTN>
  //     </CardFooter>
  //     </Card>
  //   </div>
  // );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F1F0FB] to-white px-4 py-8">
      <div className="w-full max-w-md space-y-4"> {/* Ajout d'un conteneur et espacement */}
        <Card className="shadow-xl border-0">
          <CardHeader className="flex flex-col gap-1 items-center">
            <Building2 className="mb-2 text-primary w-10 h-10" />
            <CardTitle className="text-xl font-bold text-center text-[#7E69AB]">
              Créer un laboratoire
            </CardTitle>
          </CardHeader>
          <CardContent>
{message && (
  <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
    <AlertTitle>{message.type === "error" ? "Erreur" : "Succès"}</AlertTitle>
    <AlertDescription>{message.text}</AlertDescription>
  </Alert>
)}
<form className="grid gap-5" onSubmit={handleSubmit}>
  <div>
    <Label htmlFor="FirstName">Prénom</Label>
    <Input
      required
      type="text"
      id="FirstName"
      name="FirstName"
      maxLength={20}
      placeholder="Prénom"
      value={form.FirstName}
      onChange={handleChange}
      autoComplete="given-name"
    />
  </div>
  <div>
    <Label htmlFor="LastName">Nom</Label>
    <Input
      required
      type="text"
      id="LastName"
      name="LastName"
      maxLength={20}
      placeholder="Nom"
      value={form.LastName}
      onChange={handleChange}
      autoComplete="family-name"
    />
  </div>
  <div>
    <Label htmlFor="Name">Nom de l'établissement</Label>
    <Input
      required
      type="text"
      id="Name"
      name="Name"
      maxLength={255}
      placeholder="Nom du laboratoire"
      value={form.Name}
      onChange={handleChange}
    />
  </div>
  <div>
    <Label htmlFor="email">Adresse email</Label>
    <Input
      required
      type="email"
      id="email"
      name="email"
      maxLength={255}
      placeholder="contact@labo.com"
      value={form.email}
      onChange={handleChange}
      autoComplete="email"
    />
  </div>
  <div>
    <Label htmlFor="password">Mot de passe</Label>
    <Input
      required
      type="password"
      id="password"
      name="password"
      minLength={6}
      placeholder="Mot de passe"
      value={form.password}
      onChange={handleChange}
      autoComplete="new-password"
    />
  </div>
  <Button
    type="submit"
    disabled={loading}
    className="w-full mt-1"
  >
    {loading ? "Création..." : "Créer le laboratoire"}
  </Button>
</form>

</CardContent> 
        </Card>

        {/* Bouton déplacé en dessous de la Card */}
        <BTN
          onClick={() => navigate("../DislayLabos")}
          icon={<ArrowLeftOutlined />}
          className="w-full"
        >
          Retour à l'accueil
        </BTN>
      </div>
    </div>
  );
};

export default CreateLabo;
