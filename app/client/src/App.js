import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import Marketplace from "./components/Marketplace/Marketplace";
import Submit from "./components/Projects/Submit";
import Projects from "./components/Projects/Projects";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/submit" element={<Submit />} />
          <Route exact path="/projects"  element={<Projects />} />
          <Route exact path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
