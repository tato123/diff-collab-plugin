import React, { useEffect, useState, useContext, useCallback } from "react";
import _ from "lodash";
import { fabric } from "fabric";
import { useChannel } from "../hooks/useChannel";
import { CanvasContext } from "./Canvas";
import { useStream } from "../hooks/useToken";

var lastX;
var lastY;
var currentX;
var currentY;

const mode = "twillio";

const Participants = ({ participants, myId }) => {
  const channel = useChannel("private-canvas");
  const canvas = useContext(CanvasContext);
  const stream = useStream("canvas-mouseEvents");

  const sendMessage = useCallback(() => {
    const coord = { x: currentX, y: currentY };
    if (mode === "pusher" && channel) {
      channel.trigger("client-mouseEvent", coord);
    } else if (mode === "twillio" && stream) {
      stream
        .publishMessage(coord)
        .then(function(message) {
          console.log(
            "Stream publishMessage() successful, message SID:" + message.sid
          );
        })
        .catch(function(error) {
          console.error("Stream publishMessage() failed", error);
        });
    }
  }, [channel, stream]);

  useEffect(() => {
    if (canvas && channel) {
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
          top: 100
        });

        canvas.add(group);
      });

      const mover = value => {
        if (group) {
          group.bringToFront();
          const z = canvas.getZoom();
          group.scale(0.9 / z);

          const p = value;
          group.animate("left", p.x + 40, {
            onChange: canvas.renderAll.bind(canvas),
            duration: 30
          });

          group.animate("top", p.y - 400, {
            onChange: canvas.renderAll.bind(canvas),
            duration: 30
          });
        }
      };

      if (mode === "pusher") {
        channel.bind("client-mouseEvent", data => {
          mover(data);
          console.log("Received messagePublished event: ", data);
        });
      } else if (mode === "twillio" && stream) {
        stream.on("messagePublished", function(args) {
          console.log("Stream message published");
          console.log("Message SID: " + args.message.sid);
          console.log("Message value: ", args.message.value);
          console.log("args.isLocal:", args.isLocal);

          const { isLocal, value } = args.message;
          if (isLocal) return;
          mover(value);
        });
      }
    }
  }, [canvas, channel, stream]);

  useEffect(() => {
    const animationTick = () => {
      if (currentX !== lastX || currentY !== lastY) {
        lastX = currentX;
        lastY = currentY;

        console.log("different", currentX, lastX, currentY, lastY);
        sendMessage();
      }
    };
    setInterval(animationTick, 25);
  }, [sendMessage]);

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:move", opt => {
        currentX = opt.absolutePointer.x;
        currentY = opt.absolutePointer.y;
      });
    }
  }, [canvas, myId, channel]);

  return null;
};

export default Participants;
