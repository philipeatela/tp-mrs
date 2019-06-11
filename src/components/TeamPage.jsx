import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`;

export const TeamPage = (props) => {
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

  }

  return (
    <Wrapper>
      Ola
    </Wrapper>
  );
};

export default TeamPage;