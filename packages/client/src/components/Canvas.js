import React, { Fragment, useState, useEffect, useRef } from "react";
import { fabric } from "fabric";

const DesignCanvas = ({
  width = 600,
  height = 400,
  center = [0, 0],
  children
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
    const canvas = new fabric.Canvas(c.current);

    canvas.on("mouse:wheel", function(opt) {
      let e = opt.e;

      if (e.ctrlKey === true) {
        let delta = opt.e.deltaY;
        let pzoom = canvas.getZoom();
        let zoom = pzoom + delta / 1920;
        zoom =
          zoom > pzoom ? Math.max(pzoom - 0.1, 0.1) : Math.min(pzoom + 0.1, 2);
        canvas.zoomToPoint({ x: opt.pointer.x, y: opt.pointer.y }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        return;
      }

      console.log(opt.e.deltaY);

      this.viewportTransform[4] += opt.e.deltaX;
      this.viewportTransform[5] += opt.e.deltaY;
      this.requestRenderAll();
      console.log(this.viewportTransform[4], this.viewportTransform[5]);
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
      this.isDragging = false;
      this.selection = true;
    });

    setCanvas(canvas);
  }, []);

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
      <canvas ref={c} />
      {canvas && mchildren}
    </Fragment>
  );
};

export default DesignCanvas;
