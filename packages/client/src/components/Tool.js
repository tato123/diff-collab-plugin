import React from "react";
import { Button } from "antd";
import { Icon } from "react-icons-kit";
import { pencil } from "react-icons-kit/fa/pencil";
import { mousePointer } from "react-icons-kit/fa/mousePointer";
import { ic_title } from "react-icons-kit/md/ic_title";
import styled from "styled-components";

const Container = styled.span`
  .ant-btn:hover,
  .ant-btn:focus {
    border-color: transparent !important;
  }
`;

const StyledButton = styled(Button)`
  margin-right: 4px;
  box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
  color: #586278;
  ${props =>
    props.active
      ? `
    background: #1890ff !important;
    color: #fff !important;
  `
      : ``}
  -webkit-tap-highlight-color:rgba(0,0,0,0);
`;

const ToolList = {
  select: (
    <Icon
      icon={mousePointer}
      size={16}
      style={{ position: "absolute", top: "21%", left: "38%" }}
    />
  ),
  pencil: (
    <Icon
      icon={pencil}
      size={17}
      style={{ position: "absolute", top: "21%", left: "34%" }}
    />
  ),
  text: (
    <Icon
      icon={ic_title}
      size={17}
      style={{ position: "absolute", top: "21%", left: "34%" }}
    />
  )
};

const Tool = ({ active, children, type, action, style }) => {
  console.log("is tool active", type, active);
  return (
    <Container>
      <StyledButton
        shape="circle"
        onClick={action}
        active={active}
        style={{ width: 48, height: 48, ...style }}
      >
        {ToolList[type]}
      </StyledButton>
    </Container>
  );
};

export default Tool;
