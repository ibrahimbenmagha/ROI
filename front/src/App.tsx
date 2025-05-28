import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "antd/dist/reset.css";

import NotFound from "./pages/NotFound";
import CreateActivity from "./pages/Create/Create";
import LoginForm from "./pages/LoginForm/LoginForm";
import AddActivity from "./pages/BackOffice/AddActivity/AddActivity";

import RoiResultCardAdmin from "./pages/BackOffice/RoiResultCardAdmin/RoiResultCardAdmin";

import BackOffice from "./pages/BackOffice/Home/Home";
import RealCreate from "./pages/BackOffice/CreateLabo/Creation";
import RoiResultCard from "./pages/RoiResultCard/RoiResultCard";
import DislayLabos from "./pages/BackOffice/DisplayLabo/DislayLabos";

import CalculateAct1 from "./pages/CalculateAct1/CalculateAct1";

import CustomActivityPage from "./pages/CalcutaleCustumAct/CalcutaleCustumAct";

import DisplayCalculatedActivity from "./pages/DisplayActivityByLaboCalculated/DisplayActivityByLaboCalculated";

import Unauthorized from "./pages/Unauthorized/Unauthorized";
import {
  LaboRoute,
  AdminRoute,
  AuthRoute,
  ActRoute,
  CalcRoute,
} from "./components/AuthRoute";

import CreateRegularActivity from "./pages/BackOffice/AddActivity/AddActivity";
import ActivityDispkay from "./pages/BackOffice/ActivityDisplay/ActivityDisplay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirection par défaut */}

          <Route path="*" element={<Navigate to="/CreateActivity" />} />

          <Route
            path="/BackOffice"
            element={<Navigate to="BackOffice/DislayLabos" />}
          />

          <Route
            path="/BackOffice"
            element={
              <AdminRoute>
                <BackOffice />
              </AdminRoute>
            }
          >
            <Route path="DislayLabos" element={<DislayLabos />} />
            <Route path="Creation" element={<RealCreate />} />
            <Route path="RoiResultCardAdmin" element={<RoiResultCardAdmin />} />

            <Route path="AddActivity" element={<AddActivity />} />

            <Route
              path="DisplayCalculatedActivity"
              element={<DisplayCalculatedActivity />}
            />
            <Route
              path="CreateRegularActivity"
              element={<CreateRegularActivity />}
            />
            <Route path="ActivityDispkay" element=<ActivityDispkay /> />
          </Route>

          <Route
            path="/Login"
            element={
              <AuthRoute>
                <LoginForm />
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
                <RoiResultCard />
              </LaboRoute>
            }
          />

          <Route
            path="CustomActivityPage"
            element={
              <LaboRoute>
                <CustomActivityPage />
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

          <Route path="/Unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
