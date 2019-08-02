import React, { Fragment, useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import styled, { createGlobalStyle } from "styled-components";
import "./canvas.css";

export const CanvasContext = React.createContext();

const Canvas = styled.canvas`
  cursor: url("/icon_pencil.png") 5 22, url("/icon_pencil.cur"), crosshair !important;
`;

const DesignCanvas = ({
  width = 600,
  height = 400,
  center = [0, 0],
  drawingMode = true,
  children,
  onZoom = () => {},
  onMouseMove = () => {}
}) => {
  const [canvas, setCanvas] = useState();
  const c = useRef();

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  }, [canvas, width, height]);

  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = drawingMode;
    }
  }, [canvas, drawingMode]);

  useEffect(() => {
    const canvas = new fabric.Canvas(c.current);

    canvas.freeDrawingBrush.width = 10;

    canvas.on("mouse:wheel", function(opt) {
      let e = opt.e;

      if (e.ctrlKey === true) {
        let delta = opt.e.deltaY;
        let pzoom = canvas.getZoom();
        let zoom = pzoom + delta / 1920;
        zoom =
          zoom > pzoom ? Math.max(pzoom - 0.1, 0.1) : Math.min(pzoom + 0.1, 2);

        onZoom(zoom);
        canvas.zoomToPoint({ x: opt.pointer.x, y: opt.pointer.y }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        return;
      }

      this.viewportTransform[4] += opt.e.deltaX;
      this.viewportTransform[5] += opt.e.deltaY;

      this.renderTop();
      this.renderAll();

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on("mouse:down", function(opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    canvas.on("mouse:move", function(opt) {
      if (this.isDragging) {
        var e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.on("mouse:up", function(opt) {
      if (this.isDrawingMode) {
      } else {
        this.isDragging = false;
        this.selection = true;
      }
    });

    setCanvas(canvas);
  }, [onZoom]);

  useEffect(() => {
    if (canvas && center[0]) {
      console.log("vals", center[0], center[1]);

      canvas.absolutePan(new fabric.Point(center[0], center[1]));
      canvas.requestRenderAll();

      canvas.setZoom(0.09);
    }
  }, [canvas, center]);

  return (
    <Fragment>
      <Canvas ref={c} />
      <CanvasContext.Provider value={canvas}>{children}</CanvasContext.Provider>
    </Fragment>
  );
};

export default DesignCanvas;
