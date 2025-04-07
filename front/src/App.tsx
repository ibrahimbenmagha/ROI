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
import DisplayCalculatedActivity from "./pages/DisplayActivityByLaboCalculated/DisplayActivityByLaboCalculated";
import RoiResultCard from "./pages/RoiResultCard/RoiResultCard.tsx";

import CalculateAct1 from "./pages/CalculateAct1/CalculateAct1";
import CalculateAct2 from "./pages/calculateAct2/CalculateAct2";
import CalculateAct3 from "./pages/CalculateAct3/CalculateAct3";
import CalculateAct4 from "./pages/CalculateAct4/CalculateAct4";
import CalculateAct5 from "./pages/CalculateAct5/CalculateAct5";
import CalculateAct6 from "./pages/CalculateAct6/CalculateAct6";
import CalculateAct7 from "./pages/CalculateAct7/CalculateAct7";
import CalculateAct8 from "./pages/CalculateAct8/CalculateAct8";
import CalculateAct9 from "./pages/CalculateAct9/CalculateAct9";
import CalculateAct10 from "./pages/CalculateAct10/CalculateAct10";
import CalculateAct11 from "./pages/CalculateAct11/CalculateAct11";
import CalculateAct12 from "./pages/CalculateAct12/CalculateAct12";

import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLogin from "./pages/Dashboard/DashboardLogin";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import {
  LaboRoute,
  AdminRoute,
  AuthRoute,
  ActRoute,
  CalcRoute,
} from "./components/AuthRoute";

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
            path="RoiResultCard"
            element={
              <LaboRoute>
                <CalcRoute>
                  <RoiResultCard />
                </CalcRoute>
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
            path="/DisplayCalculatedActivity"
            element={
              <LaboRoute>
                <DisplayCalculatedActivity />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct1"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct1 />
                </ActRoute>
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct2"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct2 />
                </ActRoute>
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct3"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct3 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct4"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct4 />
                </ActRoute>
              </LaboRoute>
            }
          />
          <Route
            path="/CalculateAct5"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct5 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct6"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct6 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct7"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct7 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct8"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct8 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct9"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct9 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct10"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct10 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct11"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct11 />
                </ActRoute>
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct12"
            element={
              <LaboRoute>
                <ActRoute>
                  <CalculateAct12 />
                </ActRoute>
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
