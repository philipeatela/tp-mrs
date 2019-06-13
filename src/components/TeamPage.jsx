import React from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { callEndpoint, TEAM_ID } from "../services/api";
import { parseRepositories } from "../parsers";
import Loader from "./Loader";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5em;
`;

export const TeamPage = props => {
  const [commitSuccessRate, setCommitSuccessRate] = React.useState(null);
  const [devCommitSuccessRate, setDevCommitSuccessRate] = React.useState(null);
  const [prodCommitSuccessRate, setProdCommitSuccessRate] = React.useState(
    null
  );
  React.useEffect(() => {
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

    const reposDataArray = await Promise.all(
      pipelineRepos.map(async repo => {
        const pipelinesUrl = `/repositories/${TEAM_ID}/${
          repo.id
        }/pipelines/?pagelen=100`;
        const repoPipelines = await callEndpoint(pipelinesUrl);
        let _failCount = 0;
        let _successCount = 0;
        let _prodCount = 0;
        let _devCount = 0;
        let _devSuccessCount = 0;
        let _prodSuccessCount = 0;

        let _otherCount = 0;
        let _otherSuccessCount = 0;
        let timeCounter = 0;

        let _maxConsecutiveFails = 0;
        let consecutiveFails = 0;

        const consecutiveFailsArray = [];

        repoPipelines.forEach(pipeline => {
          timeCounter = timeCounter + pipeline.duration_in_seconds;
          if (!pipeline.state || !pipeline.state.result) {
            return;
          }
          if (pipeline.state.result.name === "FAILED") {
            // Count consecutive fails
            consecutiveFails = consecutiveFails + 1;
            _failCount = _failCount + 1;

            if (pipeline.target.ref_name === "master") {
              _prodCount = _prodCount + 1;
            } else if (pipeline.target.ref_name === "develop") {
              _devCount = _devCount + 1;
            } else {
              _otherCount = _otherCount + 1;
            }
          }
          if (pipeline.state.result.name === "SUCCESSFUL") {
            // Count consecutive fails
            if (consecutiveFails > 0) {
              consecutiveFailsArray.push(consecutiveFails);
            }
            if (consecutiveFails > _maxConsecutiveFails) {
              _maxConsecutiveFails = consecutiveFails;
              consecutiveFails = 0;
            }

            _successCount = _successCount + 1;

            if (pipeline.target.ref_name === "master") {
              _prodSuccessCount = _prodSuccessCount + 1;
            } else if (pipeline.target.ref_name === "develop") {
              _devSuccessCount = _devSuccessCount + 1;
            } else {
              _otherSuccessCount = _otherSuccessCount + 1;
            }
          }
        });

        const sum = consecutiveFailsArray
          ? consecutiveFailsArray.reduce((acc, value) => {
              return (acc += value);
            }, 0)
          : 1;

        let mean;
        if (sum > 0 && consecutiveFailsArray.length > 0) {
          mean = sum / consecutiveFailsArray.length;
        }

        return {
          name: repo.name,
          data: repo.formattedDate,
          _failCount,
          _successCount,
          _prodCount,
          _devCount,
          _otherCount,
          mTime: timeCounter / repoPipelines.length,
          _prodSuccessCount,
          _devSuccessCount,
          _otherSuccessCount,
          _maxConsecutiveFails,
          mean
        };
      })
    );

    console.log(reposDataArray);
    // reposDataArray.sort((a,b) => (a.data > b.data) ? 1 : ((b.data > a.data) ? -1 : 0));

    const commitSuccessRates = reposDataArray.map(repoData => {
      const { _failCount, _successCount } = repoData;
      if (!_successCount) {
        return 0;
      }
      const failRate = _failCount / (_failCount + _successCount);
      return {
        Projeto: repoData.name,
        Falhas: failRate,
        data: repoData.data
      };
    });

    const devCommitSuccessRates = reposDataArray.map(repoData => {
      const { _devCount, _devSuccessCount } = repoData;
      if (!_devSuccessCount) {
        return 0;
      }
      const failRate = _devCount / (_devCount + _devSuccessCount);
      return {
        Projeto: repoData.name,
        Falhas: failRate,
        data: repoData.data
      };
    });

    const prodCommitSuccessRates = reposDataArray.map(repoData => {
      const { _prodCount, _prodSuccessCount } = repoData;
      if (!_prodSuccessCount) {
        return 0;
      }
      const failRate = _prodCount / (_prodCount + _prodSuccessCount);
      return {
        Projeto: repoData.name,
        Falhas: failRate,
        data: repoData.data
      };
    });
    setDevCommitSuccessRate(devCommitSuccessRates);
    setCommitSuccessRate(commitSuccessRates);
    setProdCommitSuccessRate(prodCommitSuccessRates);
  };

  return (
    <Wrapper>
      <h1>Dados consolidados do time</h1>
      {!commitSuccessRate && <Loader />}
      {commitSuccessRate && (
        <>
          <h2>Taxa de sucesso dos commits por projeto</h2>
          <BarChart
            width={1200}
            height={400}
            data={commitSuccessRate}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Projeto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Falhas" fill="#DC143C" />
          </BarChart>
        </>
      )}
      {devCommitSuccessRate && (
        <>
          <h2>Taxa de sucesso dos commits por projeto (Desenvolvimento)</h2>
          <BarChart
            width={1200}
            height={400}
            data={devCommitSuccessRate}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Projeto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Falhas" fill="#DC143C" />
          </BarChart>
        </>
      )}
      {prodCommitSuccessRate && (
        <>
          <h2>Taxa de sucesso dos commits por projeto (Produção)</h2>
          <BarChart
            width={1200}
            height={400}
            data={prodCommitSuccessRate}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Projeto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Falhas" fill="#DC143C" />
          </BarChart>
        </>
      )}
    </Wrapper>
  );
};

export default TeamPage;
