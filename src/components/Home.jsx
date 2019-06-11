import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import moment from "moment";

import { callEndpoint, endpoints, TEAM_ID } from "../services/api";
import { parseRepositories } from "../parsers";
import { navigate } from "@reach/router";
import Loader from "./Loader";

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

const List = styled.ul`
  border: 3px solid black;
  border-radius: 1%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
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
`;

const Text = styled.span`
  margin: 0.5em;
`;

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
    setRepoData(pipelineRepos);
  };

  return (
    <main className="Home">
      <AppHeader>Trabalho Prático MRS - Relatório de Builds</AppHeader>
      <AppBody>
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
      </AppBody>
      <AppFooter>Por Philipe Pinheiro Atela, 2019</AppFooter>
    </main>
  );
}

export default Home;
