import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitRequest from "./pages/SubmitRequest";
import RequestOverview from "./pages/RequestOverview";
import { Toaster } from 'sonner';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmitRequest />} />
        <Route path="/overview" element={<RequestOverview />} />
      </Routes>

      <Toaster richColors position="top-right"/>
    </BrowserRouter>
  );
};

export default App;
