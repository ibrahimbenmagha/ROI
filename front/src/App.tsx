import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "antd/dist/reset.css";

import NotFound from "./pages/NotFound";
import LoginForm from "./pages/LoginForm/LoginForm";
import CreateActivity from "./pages/Create/Create";
import RoiResultCard from "./pages/RoiResultCard/RoiResultCard";
import RoiResultCardAdmin from "./pages/BackOffice/RoiResultCardAdmin/RoiResultCardAdmin";


import BackOffice from "./pages/BackOffice/Home/Home";
import DislayLabos from "./pages/BackOffice/DisplayLabo/DislayLabos";
import RealCreate from "./pages/BackOffice/CreateLabo/Creation";

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


            <Route
              path="DisplayCalculatedActivity"
              element={<DisplayCalculatedActivity />}
            />
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
          <Route
            path="/CalculateAct5"
            element={
              <LaboRoute>
                <CalculateAct5 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct6"
            element={
              <LaboRoute>
                <CalculateAct6 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct7"
            element={
              <LaboRoute>
                <CalculateAct7 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct8"
            element={
              <LaboRoute>
                <CalculateAct8 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct9"
            element={
              <LaboRoute>
                <CalculateAct9 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct10"
            element={
              <LaboRoute>
                <CalculateAct10 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct11"
            element={
              <LaboRoute>
                <CalculateAct11 />
              </LaboRoute>
            }
          />

          <Route
            path="/CalculateAct12"
            element={
              <LaboRoute>
                <CalculateAct12 />
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
