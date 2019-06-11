import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";

import { callEndpoint, endpoints, TEAM_ID } from "../services/api";
import { parseRepositories } from "../parsers";

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

const RepoWrapper = styled.li``;

function Home({ callback }) {
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
    // setRepoData(parsedReposData);

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
        <h2>Lista de Repositórios do time:</h2>
        <ul>
          {!repoData && <p>Carregando dados...</p>}
          {repoData &&
            repoData.map(({ name, id, created_on }) => (
              <Link key={id} onClick={callback(id)} to="repo">
                <RepoWrapper>
                  <p>{`Nome: ${name}`}</p>
                  <p>{`ID: ${id}`}</p>
                  <p>{`Data de criação: ${created_on}`}</p>
                </RepoWrapper>
              </Link>
            ))}
        </ul>
      </AppBody>
      <AppFooter>Por Philipe Pinheiro Atela, 2019</AppFooter>
    </main>
  );
}

export default Home;
