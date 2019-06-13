import React from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import fs from 'fs';

import { callEndpoint, TEAM_ID } from "../services/api";
import Loader from "./Loader";

function getMostCommon(array) {
  var count = {};
  array.forEach(function(a) {
    count[a] = (count[a] || 0) + 1;
  });
  return Object.keys(count).reduce(function(r, k, i) {
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MyHeader = styled.header`
  margin: 0.5em;
  font-size: 40px;
  font-weight: bold;
  text-decoration: underline;
`;

const SubHeader = styled.h3`
  margin: 0.2em;
`;

const ResultText = styled.span`
  /* text-decoration: underline; */
  font-weight: bold;
  color: green;
  margin: 0.4em;
`;

export const RepoPage = ({ repoId }) => {
  const [failCount, setFailCount] = React.useState(null);
  const [successCount, setSuccessCount] = React.useState(null);

  const [prodCount, setProdCount] = React.useState(null);
  const [prodSuccessCount, setProdSuccessCount] = React.useState(null);
  const [devCount, setDevCount] = React.useState(null);
  const [devSuccessCount, setDevSuccessCount] = React.useState(null);

  const [otherCount, setOtherCount] = React.useState(null);
  const [otherSuccessCount, setOtherSuccessCount] = React.useState(null);

  const [meanTime, setMeanTime] = React.useState(null);

  const [mostBreaks, setMostBreaks] = React.useState(null);

  const [maxConsecutiveFails, setMaxConsecutiveFails] = React.useState(null);

  const [meanConsecutiveFails, setMeanConsecutiveFails] = React.useState(null);

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

    const authors = repoPipelines.map((pipeline, index) => {
      return pipeline.creator ? `Desenvolvedor ${index}` : "";
    });
    const filteredAuthors = authors.filter(author =>
      author === "" ? false : true
    );
    const _mostBreaks = getMostCommon(filteredAuthors);
    console.log("_maxConsecutiveFails", _maxConsecutiveFails);
    console.log("consecutiveFails", consecutiveFails);

    const sum = consecutiveFailsArray
      ? consecutiveFailsArray.reduce((acc, value) => {
          return (acc += value);
        }, 0)
      : 1;

    let mean;
    if (sum > 0 && consecutiveFailsArray.length > 0) {
      mean = sum / consecutiveFailsArray.length;
    }

    setFailCount(_failCount);
    setSuccessCount(_successCount);
    setProdCount(_prodCount);
    setDevCount(_devCount);
    setOtherCount(_otherCount);
    const mTime = timeCounter / repoPipelines.length
    setMeanTime(mTime);
    setMostBreaks(_mostBreaks);
    setDevSuccessCount(_prodSuccessCount);
    setProdSuccessCount(_devSuccessCount);
    setOtherSuccessCount(_otherSuccessCount);
    setMaxConsecutiveFails(_maxConsecutiveFails);
    setMeanConsecutiveFails(mean);

    const repoInformation = {
      _failCount,
      _successCount,
      _prodCount,
      _devCount,
      _otherCount,
        mTime,
      _mostBreaks,
      _prodSuccessCount,
      _devSuccessCount,
      _otherSuccessCount,
      _maxConsecutiveFails,
      mean,
    };
    console.log(repoInformation);
  };

  const successAndFailData = [
    {
      name: "Consolidado",
      sucesso: successCount,
      falha: failCount
    },
    {
      name: "Desenvolvimento",
      sucesso: devSuccessCount,
      falha: devCount
    },
    {
      name: "Produção",
      sucesso: prodSuccessCount,
      falha: prodCount
    },
    {
      name: "Outras",
      sucesso: otherSuccessCount,
      falha: otherCount
    }
  ];

  return (
    <Wrapper>
      {!failCount && <Loader />}
      {failCount && <MyHeader>Dados de build deste repositório</MyHeader>}
      {meanTime && (
        <SubHeader>
          Média de tempo de build:{" "}
          <ResultText>{Math.round(meanTime)} segundos</ResultText>
        </SubHeader>
      )}
      {mostBreaks && (
        <SubHeader>
          Campeao de quebras: <ResultText>{`Usuario 1`}</ResultText>
        </SubHeader>
      )}
      {maxConsecutiveFails && (
        <SubHeader>
          Máximo consecutivo de falhas:{" "}
          <ResultText>{maxConsecutiveFails}</ResultText>
        </SubHeader>
      )}
      {meanConsecutiveFails && (
        <SubHeader>
          Média de falhas consecutivas:{" "}
          <ResultText>{Math.round(meanConsecutiveFails)}</ResultText>
        </SubHeader>
      )}
      {failCount && (
        <SubHeader>Pipelines bem sucedidas x mal sucedidas</SubHeader>
      )}
      {failCount && (
        <BarChart
          width={800}
          height={400}
          data={successAndFailData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sucesso" fill="#82ca9d" />
          <Bar dataKey="falha" fill="#DC143C" />
        </BarChart>
      )}
    </Wrapper>
  );
};

export default RepoPage;
