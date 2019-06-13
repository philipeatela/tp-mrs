import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";

import { callEndpoint, endpoints, TEAM_ID } from "../services/api";
import { parseRepositories } from "../parsers";
import Loader from "./Loader";
import { reposData } from './data';

const AppHeader = styled.header`
  font-size: calc(10px + 2vmin);
  color: white;
  margin: 0.5em;
  font-size: 40px;
  text-decoration: underline;
`;

const AppBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const AppFooter = styled.footer`
  border-top: 1px solid black;
  margin: 2em;
`;

const List = styled.ul`
  border: 3px solid black;
  border-radius: 1%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
  columns: 3;
  -webkit-columns: 3;
  -moz-columns: 3;
`;

const ListItem = styled.li`
  border-bottom: 1px solid black;
  list-style-type: none;
  width: 100%;
  height: 150px;
  background-color: #949396;
  padding: 0.5em;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  opacity: 0.5;
  :hover {
    opacity: 1;
  }
`;

const Text = styled.span`
  margin: 0.5em;
`;

const Button = styled.div`
  background-color: #949396;
  width: 225px;
  margin: 1em;
  padding: 1em;
  border-radius: 2%;
  text-align: center;
  cursor: pointer;
`;

function Home({ callback }) {
  const MaxObjs = {
    _failCount: Math.max.apply(Math, reposData.map(function(o) { return o._failCount; })),
    _successCount: Math.max.apply(Math, reposData.map(function(o) { return o._successCount; })),
    _prodCount: Math.max.apply(Math, reposData.map(function(o) { return o._prodCount; })),
    _devCount: Math.max.apply(Math, reposData.map(function(o) { return o._devCount; })),
    _otherCount: Math.max.apply(Math, reposData.map(function(o) { return o._otherCount; })),
    mTime: Math.max.apply(Math, reposData.map(function(o) { return o.mTime; })),
    _prodSuccessCount: Math.max.apply(Math, reposData.map(function(o) { return o._prodSuccessCount; })),
    _devSuccessCount: Math.max.apply(Math, reposData.map(function(o) { return o._devSuccessCount; })),
    _otherSuccessCount: Math.max.apply(Math, reposData.map(function(o) { return o._otherSuccessCount; })),
    _maxConsecutiveFails: Math.max.apply(Math, reposData.map(function(o) { return o._maxConsecutiveFails; })),
    mean: Math.max.apply(Math, reposData.map(function(o) { return o.mean; })),
  }
  
  const [repoData, setRepoData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Get all of team's repos
    const allReposUrl = `/repositories/${TEAM_ID}/?pagelen=100`;
    const allReposData = await callEndpoint(allReposUrl);
    // Parse repos data
    const parsedReposData = parseRepositories(allReposData);

    // Call envs endpoint for each repo to find out which ones have CI
    const _pipelineRepos = await Promise.all(
      parsedReposData.map(async repoData => {
        const envUrl = `/repositories/${TEAM_ID}/${repoData.id}/environments/`;
        const envData = await callEndpoint(envUrl);
        if (envData.length) {
          return {
            ...repoData,
            envs: envData
          };
        } else {
          return 0;
        }
      })
    );

    // Filter out repos without CI
    const pipelineRepos = _pipelineRepos.filter(id =>
      id === 0 ? false : true
    );
    console.log(pipelineRepos);
    setRepoData(pipelineRepos);
  };

  return (
    <main className="Home">
      <AppHeader>Trabalho Prático MRS - Relatório de Builds</AppHeader>
      <AppBody>
        <Button
          onClick={() => navigate('/team')}
        >
          Visualizar Relatório Consolidado
        </Button>
        <h2>Lista de Repositórios do time:</h2>
        {!repoData && <Loader />}
        {repoData && (
          <List>
            {repoData.map(({ name, id, formattedDate }) => (
              <ListItem
                key={id}
                onClick={() => navigate(`/repo/${id}`)}
                to="repo"
              >
                <Text>{`Nome: ${name}`}</Text>
                <Text>{`Data de criação: ${formattedDate}`}</Text>
              </ListItem>
            ))}
          </List>
        )}

        <h2>Recordes dos repositorios:</h2>
        <p>Maior média de commits para re-estabelecer: {Math.round(MaxObjs.mean)}</p>
        <p>Maior número de quebras em produção: {MaxObjs._prodCount}</p>
        <p>Maior número de quebras em geral: {MaxObjs._failCount}</p>
        <p>Maior média de tempo para executar a pipeline: {Math.round(MaxObjs.mTime)} segundos</p>
        <p>Maior número de falhas consecutivas: {MaxObjs._maxConsecutiveFails}</p>
      </AppBody>
      <AppFooter>Por Philipe Pinheiro Atela, 2019</AppFooter>
    </main>
  );
}

export default Home;
