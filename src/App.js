import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Router, Link, navigate } from "@reach/router";

import "./App.css";
import Home from './components/Home';
import RepoPage from './components/RepoPage';
import LayoutBasis from './components/LayoutBasis';

function App() {
  return (
    <LayoutBasis>
      <Router>  
        <Home path="/" />
        <RepoPage path="repo/:repoId" />
      </Router> 
    </LayoutBasis>
  );
}

export default App;
