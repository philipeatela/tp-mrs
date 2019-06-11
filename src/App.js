import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Router, Link } from "@reach/router";

import "./App.css";
import Home from './components/Home';
import RepoPage from './components/RepoPage';
import LayoutBasis from './components/LayoutBasis';

function App() {
  const [currentRepo, setCurrentRepo] = useState(null);
  return (
    <LayoutBasis>
      <Router>  
        <Home path="/" callback={setCurrentRepo}/>
        <RepoPage path="repo" repoId={currentRepo} />
      </Router> 
    </LayoutBasis>
  );
}

export default App;
