import paper, { Layer, Path, Raster } from "paper";
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 5px);
`;

const usePaper = canvasRef => {
  const [paperInstance, setPaperInstance] = useState(null);

  useEffect(() => {
    if (canvasRef) {
      // Create an empty project and a view for the canvas:
      paper.setup(canvasRef.current);
      setPaperInstance(paper);

      var layer1 = paper.project.activeLayer;
      var layer2 = new Layer();

      // Draw the view now:
      paper.view.draw();

      // paper.view.onMouseUp = evt => {
      //   console.log("mouse up", evt);
      //   const results = paper.project.hitTest(evt.point);
      //   console.log("results", results);
      // };

      let circle, center;

      function press(evt) {
        const mouse = evt.point;
        center = mouse;
      }

      function drag(evt) {
        const mouse = evt.point;
        const d = mouse.subtract(center);
        const r = d.length;

        if (circle) circle.remove();
        circle = new Path.Circle(center, r);
        circle.fillColor = "#333333";
      }

      function release() {
        circle = null;
      }

      paper.view.onMouseUp = release;
      paper.view.onMouseDrag = drag;
      paper.view.onMouseDown = press;
    }
  }, [canvasRef]);

  return [paperInstance];
};

const PaperElement = ({ image, zoom }) => {
  const myCanvas = useRef(null);
  const [paper] = usePaper(myCanvas);

  useEffect(() => {
    if (paper) {
      switch (zoom) {
        case "25%":
          paper.project.view.zoom = 0.25;
          break;
        case "50%":
          paper.project.view.zoom = 0.5;
          break;
        case "75%":
          paper.project.view.zoom = 0.75;
          break;
        case "100%":
        default:
          paper.project.view.zoom = 1;
      }
    }
  }, [paper, zoom]);

  useEffect(() => {
    if (paper != null && image) {
      paper.projects[0].importSVG(image, item => {
        console.log("loaded", paper.projects[0]);
      });
    }
  }, [paper, image]);

  return <Canvas ref={myCanvas} />;
};

export default PaperElement;
