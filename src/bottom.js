import React from 'react';
import PropTypes from 'prop-types';
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";
import _ from "lodash";

class PageBottom extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            bottom: getHeight($dom)
        });
    }

    render() {
        const {blocks, style} = this.props;

        return (
            <div className="gm-printer-bottom">
                <div style={style}>
                    {_.map(blocks, (cell, i) => (
                        <div key={i} style={cell.style}>{printerStore.template(cell.text)}</div>
                    ))}
                </div>
            </div>
        );
    }
}

PageBottom.propTypes = {
    blocks: PropTypes.array.isRequired,
    style: PropTypes.object
};

PageBottom.defaultProps = {};

export default PageBottom;