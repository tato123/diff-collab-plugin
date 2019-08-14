import React, { useEffect, useContext } from "react";
import { CanvasContext } from "../Canvas";
import _ from "lodash";

const Delete = () => {
  const canvas = useContext(CanvasContext);

  useEffect(() => {
    const deleteCommand = e => {
      if (e.key === "Delete") {
        const selectedObjs = canvas.getActiveObjects();
        debugger;
        selectedObjs.forEach(element => {
          canvas.remove(element);
        });
      }
    };

    window.addEventListener("keydown", deleteCommand);

    return () => {
      window.removeEventListener("keydown", deleteCommand);
    };
  }, [canvas]);

  return null;
};

export default Delete;
