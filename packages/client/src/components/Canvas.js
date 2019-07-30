import React, { Fragment, useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import styled, { createGlobalStyle } from "styled-components";
import "./canvas.css";

const Canvas = styled.canvas`
  cursor: url("/icon_pencil.png") 5 22, url("/icon_pencil.cur"), crosshair !important;
`;

const DesignCanvas = ({
  width = 600,
  height = 400,
  center = [0, 0],
  drawingMode = true,
  children,
  onZoom = () => {}
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

    let group;
    fabric.Image.fromURL("/icon_pencil.png", function(myImg) {
      //i create an extra var for to change some image properties
      var img1 = myImg.set({ left: -28, top: 28, width: 24, height: 24 });

      var circle = new fabric.Circle({
        radius: 24,
        fill: "#171A3A",
        scaleY: 1,
        originX: "center",
        originY: "center"
      });

      var text = new fabric.Text("JF", {
        fontSize: 16,
        fill: "#fff",
        originX: "center",
        originY: "center"
      });

      group = new fabric.Group([circle, text, img1], {
        left: 150,
        top: 100
      });

      // canvas.add(group);
    });

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
    canvas.bringToFront(group);

    canvas.on("mouse:move", function(opt) {
      if (this.isDragging) {
        var e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }

      // transmitting my coordinates
      console.log(`{x: ${opt.e.clientX}, y: ${opt.e.clientY}}`);

      // if (group) {
      //   group.bringToFront();
      //   const z = canvas.getZoom();
      //   group.scale(0.9 / z);

      //   const p = canvas.getPointer(opt.e);
      //   group.left = p.x;
      //   group.top = p.y - 200;

      //   canvas.requestRenderAll();
      //   // group.zoom = 2;
      //   // canvas.bringToFront(group);

      //   // this.requestRenderAll();
      // }
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

  const mchildren = React.Children.map(children, child => {
    return React.cloneElement(child, {
      canvas: canvas
    });
  });
  return (
    <Fragment>
      <Canvas ref={c} />
      {canvas && mchildren}
    </Fragment>
  );
};

export default DesignCanvas;
