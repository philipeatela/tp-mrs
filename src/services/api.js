import { create } from 'apisauce'

const username = 'philipeatela'
const pw = '3wkA8zuH2SSY2qH57jk6'
const authdata = Buffer.from(username + ':' + pw).toString('base64')

const api = create({
  headers: {
    'Authorization': 'Basic ' + authdata,
  }
})
const rawApi = create({
  headers: {
    'Authorization': 'Basic ' + authdata,
  }
});
api.setBaseURL('https://api.bitbucket.org/2.0');
const TEAM_ID = '{3c98f9a4-15e8-4013-abe6-b97bbb25671e}'

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}

export const callEndpoint = async (endpoint) => {
  console.log('Calling initial endpoint.')
  const result = await endpoint()
  let dataValues = []
  let data
  if (result.ok) {
    data = result.data
    dataValues = result.data.values
    if (!data.pagelen || !data.next) {
      return dataValues
    }

    let nextUrl = data.next
    const pages = Math.ceil(data.size / data.pagelen)

    for (let i = 0; i < pages ;i++) {
      await delay(2000);
      console.log(`Attempting to call page ${i + 2} ${nextUrl}`);
      const response = await rawApi.get(nextUrl);
      console.log(response);
      if (response.ok) {
        console.log('Uptading data array and url...')
        const newData = response.data.values;
        dataValues = [...dataValues, ...newData];
        nextUrl = response.data.next;
      } else {
        console.log('Failed to call next endpoint.')
      }
    }
    return dataValues;
  }
  if (!result.ok && result.problem) {
    return 'Failed to call endpoint.'
  }
}

const parseRepositories = data => {
  const values = data.values;
  const parsedData = values.map(({ full_name, created_on, mainbranch, uuid }) => ({
    name: full_name,
    created_on,
    mainbranch,
    id: uuid,
  }));

  return parsedData;
}

export const endpoints = {
  getAllRepositories: () => api.get(`/repositories/${TEAM_ID}/`),
}

callEndpoint(endpoints.getAllRepositories)
