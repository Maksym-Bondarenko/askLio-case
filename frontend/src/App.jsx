import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitRequest from "./pages/SubmitRequest";
import RequestOverview from "./pages/RequestOverview";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmitRequest />} />
        <Route path="/overview" element={<RequestOverview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
