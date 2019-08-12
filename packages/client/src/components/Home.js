import React from "react";
import PlaceholderImg from "./assets/undraw_experience_design.svg";
import styled from "styled-components";
import { Row, Col, Empty, Button } from "antd";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const FullHeightRow = styled(Row)`
  height: 100% !important;
  display: flex !important;
`;

const CenteredCol = styled(Col)`
  justify-content: center;
  align-items: center;
  display: flex !important;
`;

const Home = () => (
  <Container>
    <FullHeightRow>
      <Col span={8} />
      <CenteredCol span={8}>
        <Empty
          image={PlaceholderImg}
          imageStyle={{
            height: 200
          }}
          description={
            <span>Get started by Adding the plugin for Adobe XD </span>
          }
        >
          <Button
            href="https://collab-diff-releases.s3.amazonaws.com/diff-collab-latest.xdx"
            type="primary"
          >
            Download Adobe XD Plugin
          </Button>
        </Empty>
      </CenteredCol>
      <Col span={8} />
    </FullHeightRow>
  </Container>
);

export default Home;
