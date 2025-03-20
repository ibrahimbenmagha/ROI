import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "./pages/LoginForm/LoginForm";
import CreateActivity from "./pages/CreateActiviteByLoabo/CreateActivity"
import DisplayActivity from "./pages/DisplayActivityByLabo/DisplayActivityByLabo";
import CalculateAct1 from "./pages/CalculateAct1/CalculateAct1";
import CalculateAct2 from "./pages/calculateAct2/CalculateAct2";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
          <Route path="CreateActivity" element={<CreateActivity/>}/>
          <Route path="/Home" element={<Index />} />
          <Route path="/DisplayActivity" element={<DisplayActivity/>} />
          <Route path="/CalculateAct1" element={<CalculateAct1/>} />
          <Route path="/CalculateAct2" element={<CalculateAct2/>} />


        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
