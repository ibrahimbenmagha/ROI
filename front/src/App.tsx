import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "antd/dist/reset.css";

// Importer tes composants de route personnalisés

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "./pages/LoginForm/LoginForm";
import CreateActivity from "./pages/CreateActiviteByLoabo/CreateActivity";
import DisplayActivity from "./pages/DisplayActivityByLabo/DisplayActivityByLabo";
import CalculateAct1 from "./pages/CalculateAct1/CalculateAct1";
import CalculateAct2 from "./pages/calculateAct2/CalculateAct2";
import CalculateAct3 from "./pages/CalculateAct3/CalculateAct3";
import CalculateAct4 from "./pages/CalculateAct4/CalculateAct4";

import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLogin from "./pages/Dashboard/DashboardLogin";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import { LaboRoute, AdminRoute, AuthRoute } from "./components/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/Home" />} />

          {/* Routes d'authentification */}
          <Route
            path="/Login"
            element={
              <AuthRoute>
                <LoginForm />
              </AuthRoute>
            }
          />

          <Route
            path="/DashboardLogin"
            element={
              <AuthRoute>
                <DashboardLogin />
              </AuthRoute>
            }
          />

          {/* Routes pour le rôle Laboratoire */}
          <Route
            path="/Home"
            element={
              <AuthRoute>
                <Index />
              </AuthRoute>
            }
          />
          <Route
            path="CreateActivity"
            element={
              <LaboRoute>
                <CreateActivity />
              </LaboRoute>
            }
          />
          <Route
            path="/DisplayActivity"
            element={
              <LaboRoute>
                <DisplayActivity />
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct1"
            element={
              <LaboRoute>
                <CalculateAct1 />
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct2"
            element={
              <LaboRoute>
                <CalculateAct2 />
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct3"
            element={
              <LaboRoute>
                <CalculateAct3 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct4"
            element={
              <LaboRoute>
                <CalculateAct4 />
              </LaboRoute>
            }
          />

          {/* Routes pour le rôle Admin */}
          <Route
            path="/Dashboard/*"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          {/* Autres routes */}
          <Route path="/Unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
