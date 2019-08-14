import React, { useContext, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import { CanvasContext } from "../Canvas";
import styled from "styled-components";
import { fabric } from "fabric";
import { SocketContext } from "../../../hooks/useSocket";

const TextContainer = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;

  input {
    border: none;
    outline: none;
    background: transparent;
  }
`;

export const TextListener = () => {
  const canvas = useContext(CanvasContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    socket.on("activity", msg => {
      if (msg.t === "text") {
        new fabric.Text.fromObject(msg.d, text => {
          text.set("sync", false);
          canvas.add(text);
        });
      }
    });
  }, [canvas, socket]);

  return null;
};

const Select = () => {
  const canvas = useContext(CanvasContext);
  const socket = useContext(SocketContext);
  const [el, setEl] = useState(null);
  const [abs, setAbs] = useState({});
  const [mouse, setMouse] = useState({});
  const [active, setActive] = useState(false);
  const textBox = useRef(null);
  const [textValue, setTextValue] = useState();

  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    canvas.selection = false;
    canvas.isDrawingMode = false;

    const mouseHandler = opt => {
      const mouse = opt.e;
      const abs = opt.absolutePointer;

      if (!active) {
        setActive(true);
      } else if (active) {
        // if we already are active, submit what we've got

        const dataX = parseFloat(textBox.current.dataset.x);
        const dataY = parseFloat(textBox.current.dataset.y);
        const val = textValue;
        const text = new fabric.Text(val, {
          left: dataX,
          top: dataY,
          scaleX: 10,
          scaleY: 10
        });
        canvas.add(text);
        canvas.bringToFront(text);
        socket.emit("activity", { d: text.toObject(), t: "text" });
        console.log("val is", val, dataX, dataY);

        setTextValue("");
      }

      // create the text box
      setMouse(mouse);
      setAbs(abs);
      textBox.current.focus();
    };

    canvas.on("mouse:up", mouseHandler);

    return () => {
      canvas.selection = true;
      canvas.off("mouse:up", mouseHandler);
    };
  }, [active, canvas, socket, textValue]);

  // add a new textbox
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "textbox";
    document.body.appendChild(el);
    setEl(el);
  }, []);

  if (el && active) {
    return ReactDOM.createPortal(
      <TextContainer x={mouse.x} y={mouse.y}>
        <input
          autoFocus
          ref={textBox}
          type="text"
          data-x={abs.x}
          data-y={abs.y}
          onChange={e => setTextValue(e.currentTarget.value)}
          value={textValue}
          placeholder="Type Text Here"
        />
      </TextContainer>,
      el
    );
  }

  return null;
};

export default Select;
