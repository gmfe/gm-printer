import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./style.less";

class Flex extends React.Component {
  render() {
    const {
      flex,

      auto,
      none,
      width,
      height,

      row,
      column,

      wrap,
      nowrap,

      justifyStart,
      justifyEnd,
      justifyCenter,
      justifyBetween,
      justifyAround,

      alignStart,
      alignEnd,
      alignCenter,
      alignBaseline,
      alignStretch,

      alignContentStart,
      alignContentEnd,
      alignContentCenter,
      alignContentBetween,
      alignContentAround,
      alignContentStretch,

      className,
      style,

      ...rest
    } = this.props;
    const cn = classNames(
      {
        "malai-flex": true,

        "malai-flex-flex": flex,
        "malai-flex-auto": auto,
        "malai-flex-none": none || width || height,

        "malai-flex-row": row,
        "malai-flex-column": column,

        "malai-flex-wrap": wrap,
        "malai-flex-nowrap": nowrap,

        "malai-flex-justify-start": justifyStart,
        "malai-flex-justify-end": justifyEnd,
        "malai-flex-justify-center": justifyCenter,
        "malai-flex-justify-between": justifyBetween,
        "malai-flex-justify-around": justifyAround,

        "malai-flex-align-start": alignStart,
        "malai-flex-align-end": alignEnd,
        "malai-flex-align-center": alignCenter,
        "malai-flex-align-baseline": alignBaseline,
        "malai-flex-align-stretch": alignStretch,

        "malai-flex-align-content-start": alignContentStart,
        "malai-flex-align-content-end": alignContentEnd,
        "malai-flex-align-content-center": alignContentCenter,
        "malai-flex-align-content-between": alignContentBetween,
        "malai-flex-align-content-around": alignContentAround,
        "malai-flex-align-content-stretch": alignContentStretch
      },
      className
    );

    let s = Object.assign({}, style);
    if (flex) {
      s.flex = typeof flex === "boolean" ? 1 : flex;
      s.WebKitFlex = typeof flex === "boolean" ? 1 : flex;
    }
    if (height) {
      s.height = height;
    }
    if (width) {
      s.width = width;
    }

    return (
      <div {...rest} className={cn} style={s}>
        {this.props.children}
      </div>
    );
  }
}

Flex.propTypes = {
  flex: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  auto: PropTypes.bool,
  none: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  row: PropTypes.bool,
  column: PropTypes.bool,
  wrap: PropTypes.bool,
  nowrap: PropTypes.bool,
  justifyStart: PropTypes.bool,
  justifyEnd: PropTypes.bool,
  justifyCenter: PropTypes.bool,
  justifyBetween: PropTypes.bool,
  justifyAround: PropTypes.bool,
  alignStart: PropTypes.bool,
  alignEnd: PropTypes.bool,
  alignCenter: PropTypes.bool,
  alignBaseline: PropTypes.bool,
  alignStretch: PropTypes.bool,
  alignContentStart: PropTypes.bool,
  alignContentEnd: PropTypes.bool,
  alignContentCenter: PropTypes.bool,
  alignContentBetween: PropTypes.bool,
  alignContentAround: PropTypes.bool,
  alignContentStretch: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Flex;
