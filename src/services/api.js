import { create } from 'apisauce'

const username = 'philipeatela'
const pw = ''
// const authdata = window.btoa(username + ':' + pw)
const authdata = Buffer.from(username + ':' + pw).toString('base64')

// const api = create({
//   baseUrl: 'https://api.bitbucket.org/2.0',
//   headers: {
//     'Authorization': 'Basic ' + authdata,
//   }
// })

const TEAM_ID = '{3c98f9a4-15e8-4013-abe6-b97bbb25671e}'

const callEndpoint = async () => {
  // const result = await api.get(`/repositories/${TEAM_ID}/`)
  const api = create({
    headers: {
      'Authorization': 'Basic ' + authdata,
    }})
  api.setBaseURL('https://api.bitbucket.org/2.0');
  console.log(api.baseUrl);
  const result = await api.get(`/repositories/{3c98f9a4-15e8-4013-abe6-b97bbb25671e}/`)
  console.log('Attempting request...')
  console.log(result)
}

callEndpoint()