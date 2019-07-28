import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { fabric } from "fabric";

class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  static defaultProps = {
    width: 600,
    height: 400
  };

  state = {
    canvas: null
  };

  componentDidMount() {
    const canvas = new fabric.Canvas(this.c);

    canvas.on("mouse:wheel", function(opt) {
      let delta = opt.e.deltaY;
      let pzoom = canvas.getZoom();
      let zoom = pzoom + delta / 1920;
      zoom =
        zoom > pzoom ? Math.min(pzoom + 0.07, 2) : Math.max(pzoom - 0.07, 0.1);

      console.log(zoom);

      canvas.zoomToPoint({ x: opt.pointer.x, y: opt.pointer.y }, zoom);
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

    this.setState({ canvas });
  }

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        canvas: this.state.canvas
      });
    });
    const { width, height } = this.props;
    return (
      <Fragment>
        <canvas ref={c => (this.c = c)} width={width} height={height} />
        {this.state.canvas && children}
      </Fragment>
    );
  }
}

export default DesignCanvas;
