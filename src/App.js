import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import './App.css';
import { callEndpoint, endpoints } from './services/api';
import { parseRepositories } from './parsers';

const AppHeader = styled.header`
  font-size: calc(10px + 2vmin);
  color: white;
  margin: 2em;
`;

const AppBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const AppFooter = styled.footer`
  margin: 2em;
`;

const RepoWrapper = styled.div`
`;

function App() {
  const [repoData, setRepoData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await callEndpoint(endpoints.getAllRepositories);
    setRepoData(parseRepositories(data));
  }

  return (
    <body className="App">
      <AppHeader>
        Trabalho Prático MRS - Relatório de Builds
      </AppHeader>
      <AppBody>
        <h2>Lista de Repositórios do time:</h2>
        {!repoData && <p>Carregando dados...</p>}
        {repoData && repoData.map(({ name, id, created_on }) => (
          <RepoWrapper>
            <p>{`Nome: ${name}`}</p>
            <p>{`ID: ${id}`}</p>
            <p>{`Data de criação: ${created_on}`}</p>
          </RepoWrapper>
        ))}
      </AppBody>
      <AppFooter>
        Por Philipe Pinheiro Atela, 2019
      </AppFooter>
    </body>
  );
}

export default App;
