import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import logo from './logo.svg';
import './App.css';
import { callEndpoint, endpoints } from './services/api';

const AppHeader = styled.header`
  font-size: calc(10px + 2vmin);
  color: white;
`;

const AppBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  min-height: 100vh;
`;

const AppFooter = styled.footer`
`;

function App() {
  const [repoData, setRepoData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await callEndpoint(endpoints.getAllRepositories);
    setRepoData(data);
  }

  console.log(repoData);

  return (
    <div className="App">
      <AppHeader>
        Trabalho Prático MRS - Relatório de Builds
      </AppHeader>
      <AppBody>
        <p>Segue relatório inicial consolidado de informações de build de um projeto específico:</p>
        {!repoData && <p>Carregando dados...</p>}
        {repoData && <p>Carregado</p>}
      </AppBody>
      <AppFooter>
        Por Philipe Pinheiro Atela, 2019
      </AppFooter>
    </div>
  );
}

export default App;
