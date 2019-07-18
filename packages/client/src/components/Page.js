import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #fff;
  height: 100%;
  width: 100%;
`;

const Page = ({ children }) => <Container>{children}</Container>;

export default Page;
