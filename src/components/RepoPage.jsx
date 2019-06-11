import React from 'react';
import styled from 'styled-components';

import { callEndpoint, TEAM_ID } from '../services/api';

function getMostCommon(array) {
  var count = {};
  array.forEach(function (a) {
      count[a] = (count[a] || 0) + 1;
  });
  return Object.keys(count).reduce(function (r, k, i) {
      if (!i || count[k] > count[r[0]]) {
          return [k];
      }
      if (count[k] === count[r[0]]) {
          r.push(k);
      }
      return r;
  }, []);
}

const Wrapper = styled.div`

`;

export const RepoPage = ({ repoId }) => {
  const [failCount, setFailCount] = React.useState(null);
  const [successCount, setSuccessCount] = React.useState(null);

  const [prodCount, setProdCount] = React.useState(null);
  const [devCount, setDevCount] = React.useState(null);
  const [otherCount, setOtherCount] = React.useState(null);

  const [meanTime, setMeanTime] = React.useState(null);

  const [mostBreaks, setMostBreaks] = React.useState(null);

  React.useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const pipelinesUrl = `/repositories/${TEAM_ID}/${repoId}/pipelines/?pagelen=100`;
    const repoPipelines = await callEndpoint(pipelinesUrl);
    let _failCount = 0;
    let _successCount = 0;
    let _prodCount = 0;
    let _devCount = 0;
    let _otherCount = 0;
    let timeCounter = 0;

    repoPipelines.forEach(pipeline => {
      timeCounter = timeCounter + pipeline.duration_in_seconds;
      if (!pipeline.state || !pipeline.state.result){
        return;
      }
      if (pipeline.state.result.name === 'FAILED') {
        _failCount = _failCount + 1;

        if (pipeline.target.ref_name === 'master') {
          _prodCount = _prodCount + 1;
        } else if (pipeline.target.ref_name === 'develop') {
          _devCount = _devCount + 1;
        } else {
          _otherCount = _otherCount + 1;
        }

      }
      if (pipeline.state.result.name === 'SUCCESSFUL') {
        _successCount = _successCount + 1;
      }
    })

    const authors = repoPipelines.map(pipeline => {
      return pipeline.creator ? pipeline.creator.username : '';
    });
    const filteredAuthors = authors.filter((author) => author === '' ? false : true);
    const _mostBreaks = getMostCommon(filteredAuthors);

    setFailCount(_failCount);
    setSuccessCount(_successCount);
    setProdCount(_prodCount);
    setDevCount(_devCount);
    setOtherCount(_otherCount);
    setMeanTime(timeCounter / repoPipelines.length);
    setMostBreaks(_mostBreaks);

  }

  return (
    <Wrapper>
      {!failCount && <p>Carregando dados...</p>}
      {failCount && <h1>Quebras de build: {failCount}</h1>}
      {successCount && <h1>Pipelines bem sucedidas: {successCount}</h1>}

      {prodCount && <h1>Quebras em produção: {prodCount}</h1>}
      {devCount && <h1>Quebras em desenvolvimento: {devCount}</h1>}
      {otherCount && <h1>Quebras em feature: {otherCount}</h1>}

      {meanTime && <h1>Média de tempo de build: {Math.round(meanTime)} segundos</h1>}

      {mostBreaks && <h1>Campeao de quebras: {mostBreaks}</h1>}
    </Wrapper>
  );
};

export default RepoPage;