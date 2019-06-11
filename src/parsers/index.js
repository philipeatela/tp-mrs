import moment from 'moment';

export const parseRepositories = data => {
  // const values = data.values;
  if (!data)
    return;
  const parsedData = data.map(
    ({ full_name, created_on, mainbranch, uuid }, index) => {
      const formattedDate = moment(created_on).format('DD-MM-YYYY');
      const name = `Projeto ${index + 1}`;
      return ({
        name,
        formattedDate,
        mainbranch,
        id: uuid
      })
    }
  );

  return parsedData;
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