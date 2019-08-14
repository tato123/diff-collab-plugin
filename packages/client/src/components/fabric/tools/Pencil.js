import React, { useContext, useEffect } from "react";
import { CanvasContext } from "../Canvas";
import { SocketContext } from "../../../hooks/useSocket";
import { fabric } from "fabric";

const type = "path:created";

export const PencilListener = () => {
  const canvas = useContext(CanvasContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    socket.on("activity", msg => {
      if (msg.t === type) {
        new fabric.Path.fromObject(msg.d, path => {
          path.set("sync", false);
          canvas.add(path);
        });
      }
    });
  }, [canvas, socket]);

  return null;
};

const Pencil = () => {
  const canvas = useContext(CanvasContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;

    const pathCreated = opt => {
      const path = opt.path.toObject();
      socket.emit("activity", { d: path, t: type });

      console.log("new path created", path);
    };

    canvas.on("path:created", pathCreated);

    return () => {
      canvas.isDrawingMode = false;
      canvas.off("path:created", pathCreated);
    };
  }, [canvas, socket]);

  return null;
};

export default Pencil;
