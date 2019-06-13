import moment from 'moment';

export const parseRepositories = data => {
  // const values = data.values;
  if (!data)
    return;
  const parsedData = data.map(
    ({ full_name, created_on, mainbranch, uuid }, index) => {
      const formattedDate = moment(created_on).format('DD-MM-YYYY');
      const name = `P${index + 1}`;
      // const name = full_name;
      return ({
        full_name,
        name,
        formattedDate,
        mainbranch,
        id: uuid
      })
    }
  );

  const filterRepos = parsedData.filter(repo => {
    // if (repo.full_name === "natahouse/frontend-ci-test") {
    //   return false;
    // }
    // if (repo.full_name === "natahouse/foco-app-create-log") {
    //   return false;
    // }
    return true;
  })

  return filterRepos;
};

export const parsePipelines = data => {
  const values = data.values;
  const parsedData = values.map(
    ({ full_name, created_on, mainbranch, uuid, environments, state, commit, trigger }) => ({
      name: full_name,
      created_on,
      mainbranch,
      id: uuid,
      environments,
      state,
      commit,
      trigger,
    })
  );

  return parsedData;
};