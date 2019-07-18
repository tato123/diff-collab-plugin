import paper, { Layer, Path } from "paper";
import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 1920px;
  height: 100%;
`;

const usePaper = canvasRef => {
  useEffect(() => {
    if (canvasRef) {
      // Create an empty project and a view for the canvas:
      paper.setup(canvasRef.current);

      var layer1 = paper.project.activeLayer;
      var layer2 = new Layer();

      paper.projects[0].importSVG("/rendering.svg", item => {
        console.log("loaded", paper.projects[0]);

        layer2.activate();

        // Create a Paper.js Path to draw a line into it:
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = "black";
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:
        path.lineTo(start.add([200, -50]));
      });

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
};

const PaperElement = () => {
  const myCanvas = useRef(null);
  usePaper(myCanvas);

  return <Canvas ref={myCanvas} />;
};

export default PaperElement;
