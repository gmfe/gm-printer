import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Flex from "./components/flex";
import "./style.less";
import { printerJS } from "./util";
import { doPrint, doPrintBatch } from "./do_print";

class SimpleConfig extends React.Component {
  componentDidMount() {
    const $iframe = ReactDOM.findDOMNode(this.refIframe);
    this.$iframe = $iframe;

    const script = $iframe.contentWindow.document.createElement("script");
    script.src = printerJS;
    $iframe.contentWindow.document.body.append(script);

    script.addEventListener("load", () => {
      this.doRender();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reRenderKey !== this.props.reRenderKey) {
      this.doRender(nextProps);
    }
  }

  doRender = nextProps => {
    const props = { ...this.props, ...nextProps };
    const { data, tableData, isBatch, config } = props;
    if (isBatch) {
      this.$iframe.contentWindow.renderBatch({
        datas: data,
        tableDatas: tableData,
        config
      });
    } else {
      this.$iframe.contentWindow.render({
        data,
        tableData,
        config
      });
    }
  };

  handlePrint = () => {
    const { data, tableData, isBatch, config, handlePrint } = this.props;
    handlePrint && handlePrint();

    if (isBatch) {
      doPrintBatch({ datas: data, tableDatas: tableData, config });
    } else {
      doPrint({ data, tableData, config });
    }
  };

  render() {
    const { configSelect, content, style } = this.props;
    const _style = { width: "240px", ...style };

    return (
      <Flex
        className="gm-printer-config"
        style={{ height: "100%", width: "100%" }}
      >
        <Flex
          flex
          column
          style={{ minWidth: "820px" }}
          className="gm-overflow-y"
        >
          <iframe
            ref={ref => {
              this.refIframe = ref;
            }}
            style={{ border: "none", width: "100%", height: "100%" }}
          />
        </Flex>
        <Flex column style={_style}>
          <Flex justifyBetween className="gm-padding-10">
            {configSelect}
            <button className="btn btn-success" onClick={this.handlePrint}>
              打印
            </button>
          </Flex>
          <div>{content}</div>
        </Flex>
      </Flex>
    );
  }
}

SimpleConfig.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  tableData: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  config: PropTypes.object.isRequired,
  style: PropTypes.object,
  handlePrint: PropTypes.func
};

export default SimpleConfig;