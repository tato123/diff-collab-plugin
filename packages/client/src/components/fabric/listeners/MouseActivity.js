import React, { useEffect, useContext, useCallback, useState } from "react";
import { fabric } from "fabric";

import { CanvasContext } from "../Canvas";
import { SocketContext } from "../../../hooks/useSocket";

var lastX;
var lastY;
var currentX;
var currentY;

const MouseActivity = () => {
  const canvas = useContext(CanvasContext);
  const socket = useContext(SocketContext);

  const sendMessage = useCallback(() => {
    console.log("sending message", socket);
    if (socket) {
      const coord = { x: currentX, y: currentY, t: "mousemove" };
      socket.emit("activity", coord);
    }
  }, [socket]);

  useEffect(() => {
    if (canvas && socket) {
      let group;

      fabric.Image.fromURL("/icon_pencil.png", function(myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({ left: -28, top: 28, width: 24, height: 24 });

        var circle = new fabric.Circle({
          radius: 24,
          fill: "#171A3A",
          scaleY: 0.5,
          scaleX: 0.5,
          originX: "center",
          originY: "center"
        });

        var text = new fabric.Text("JF", {
          fontSize: 16,
          fill: "#fff",
          originX: "center",
          originY: "center"
        });

        group = new fabric.Group([circle, text], {
          left: 150,
          top: 100,
          absolutePositioned: true,
          originX: "left",
          originY: "top"
        });

        canvas.add(group);
      });

      const mover = value => {
        if (group) {
          group.bringToFront();
          const z = canvas.getZoom();
          group.scale(0.9 / z);

          const p = value;
          group.left = p.x;
          group.top = p.y;

          canvas.requestRenderAll();
        }
      };

      socket.on("activity", msg => {
        if (msg.t === "mousemove") {
          mover(msg);
        }
      });
    }
  }, [canvas, socket]);

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:move", opt => {
        currentX = opt.absolutePointer.x;
        currentY = opt.absolutePointer.y;
      });
    }
  }, [canvas]);

  useEffect(() => {
    const animationTick = () => {
      if (currentX !== lastX || currentY !== lastY) {
        lastX = currentX;
        lastY = currentY;

        // console.log("different", currentX, lastX, currentY, lastY);
        sendMessage();
      }
    };
    setInterval(animationTick, 25);
  }, [sendMessage]);

  return null;
};

export default MouseActivity;