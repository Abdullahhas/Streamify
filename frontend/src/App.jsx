import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "./lib/axios";

function App() {
 

  const { data:authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");

      return res.data;
    },
    retry : false

  });

  const authUser = authData?.user

  

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <HomePage />:<Navigate to={"/login"}/>} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={"/"}/>} />
        <Route path="/login" element={!authUser ?<LoginPage /> : <Navigate to={"/"}/>} />
        <Route path="/notification" element={authUser ?<NotificationsPage />: <Navigate to={"/login"}/>} />
        <Route path="/call" element={authUser ?<CallPage />: <Navigate to={"/login"}/>} />
        <Route path="/chat" element={authUser ?<ChatPage />: <Navigate to={"/login"}/>} />
        <Route path="/onboarding" element={authUser ?<OnBoardingPage />: <Navigate to={"/login"}/>} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
