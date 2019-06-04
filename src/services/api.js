import { create } from 'apisauce'

const username = 'philipeatela'
const pw = '3wkA8zuH2SSY2qH57jk6'
const authdata = Buffer.from(username + ':' + pw).toString('base64')

const api = create({
  headers: {
    'Authorization': 'Basic ' + authdata,
  }
})
api.setBaseURL('https://api.bitbucket.org/2.0');
const TEAM_ID = '{3c98f9a4-15e8-4013-abe6-b97bbb25671e}'

export const callEndpoint = async (endpoint) => {
  const result = await endpoint()
  if (result.ok) {
    return result.data;
  }
  if (!result.ok && result.problem) {
    return 'Failed to call endpoint.'
  }
}

export const endpoints = {
  getAllRepositories: () => api.get(`/repositories/${TEAM_ID}/`),
}

callEndpoint(endpoints.getAllRepositories)
