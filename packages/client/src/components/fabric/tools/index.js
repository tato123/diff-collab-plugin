import React, { useEffect } from "react";
import Select from "./Select";
import Pencil, { PencilListener } from "./Pencil";
import Text, { TextListener } from "./Text";

const selectTool = tool => {
  switch (tool) {
    case "pencil":
      return <Pencil />;
    case "text":
      return <Text />;
    case "select":
    default:
      return <Select />;
  }
};

const ActiveTool = ({ tool }) => {
  useEffect(() => {
    console.log("active tool is ", tool);
  }, [tool]);

  return (
    <>
      {selectTool(tool)}
      <TextListener />
      <PencilListener />
    </>
  );
};

export default ActiveTool;
