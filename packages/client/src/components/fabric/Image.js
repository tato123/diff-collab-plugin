import React, { useEffect, useContext } from "react";
import _ from "lodash";
import { fabric } from "fabric";
import { CanvasContext } from "./Canvas";

const Image = ({ url, scale = 1.0, selectable, sync = true, ...rest }) => {
  const canvas = useContext(CanvasContext);
  useEffect(() => {
    if (canvas) {
      const options = _.omit(rest, ["scale"]);
      fabric.Image.fromURL(
        url,
        img => {
          img.scale(scale);
          canvas.add(img);
        },
        {
          left: options.left,
          top: options.top,
          hasControls: false,
          lockMovementY: true,
          lockMovementX: true,
          sync
        }
      );
    }
  }, [canvas, rest, scale, sync, url]);

  return null;
};

export default Image;
