import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { fabric } from "fabric";

class Image extends React.Component {
  static propTypes = {
    canvas: PropTypes.object,
    url: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  };

  static defaultProps = {
    scale: 1.0
  };

  componentDidMount() {
    const options = _.omit(this.props, ["scale"]);
    fabric.Image.fromURL(
      this.props.url,
      img => {
        img.scale(this.props.scale);
        this.props.canvas.add(img);
      },
      options
    );
  }

  render() {
    return null;
  }
}

export default Image;
