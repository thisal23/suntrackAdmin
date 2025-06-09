import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Add other routes here */}
    </Routes>
  );
}

export default App;
