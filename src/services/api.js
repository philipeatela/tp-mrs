import { create } from "apisauce";

const username = "philipeatela";
const pw = "YvpagvbPTtwGkZhGKLSw";
const authdata = Buffer.from(username + ":" + pw).toString("base64");

const api = create({
  headers: {
    Authorization: "Basic " + authdata
  }
});
api.setBaseURL("https://api.bitbucket.org/2.0");
export const TEAM_ID = "{3c98f9a4-15e8-4013-abe6-b97bbb25671e}";

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}

export const callEndpoint = async (endpoint) => {
  const result = await api.get(endpoint);
  let dataValues = [];
  let data;
  if (result.ok) {
    data = result.data;
    dataValues = result.data.values;

    if (!data.size) {
      return dataValues;
    }
    const pages = Math.ceil(data.size / data.pagelen);

    if (pages <= 1) {
      return dataValues;
    }
    let nextUrl;
    for (let i = 0; i < pages; i++) {
      nextUrl = `${endpoint}&page=${i + 2}`;
      await delay(1000);
      console.log(`Attempting to call page ${i + 2} ${nextUrl}`);
      const response = await api.get(nextUrl);
      console.log(response);
      if (response.ok) {
        console.log("Updating data array and url...");
        const newData = response.data.values;
        dataValues = [...dataValues, ...newData];
      } else {
        console.log("Failed to call next endpoint.");
        break;
      }
    }
    return dataValues;
  }
  if (!result.ok && result.problem) {
    return "Failed to call endpoint.";
  }
};

export const endpoints = {
  getAllRepositories: () => `/repositories/${TEAM_ID}/?pagelen=100`,
  getRepoEnvironments: repoId => `/repositories/${TEAM_ID}/${repoId}/environments/`,
  getRepoPipelines: repoId => `/repositories/${TEAM_ID}/${repoId}/pipelines/?pagelen=100`,
};
