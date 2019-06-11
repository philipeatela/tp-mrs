import React from 'react';
import styled from 'styled-components';

import { callEndpoint, TEAM_ID } from '../services/api';

const Wrapper = styled.div`

`;

export const RepoPage = ({ repoId }) => {
  const [repoData, setRepoData] = React.useState(null);
  React.useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const pipelinesUrl = `/repositories/${TEAM_ID}/${repoId}/pipelines/?pagelen=100`;
    const repoCommits = await callEndpoint(pipelinesUrl);
    console.log(repoCommits);
    console.log(repoCommits.length);
  }

  return (
    <Wrapper>
      {!repoData && <p>Carregando dados...</p>}
    </Wrapper>
  );
};

export default RepoPage;