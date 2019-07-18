import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Page from "./Page";
import Video from "./Video";
import Paper from "./Paper";

const Container = styled.div`
  display: grid;
  grid-template-areas: ". .";
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 200px;
  height: 100%;
  width: 100%;
`;

const Stage = styled.div`
  background: #fafafa;
  overflow: auto;
`;

const Room = ({ match }) => {
  return (
    <Page>
      <Container>
        <Stage>
          <Paper />
        </Stage>
        <div>
          <Video />
        </div>
      </Container>
    </Page>
  );
};

export default Room;
