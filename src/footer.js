import React from 'react';
import PropTypes from "prop-types";
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";
import _ from "lodash";
import {observer} from "mobx-react";

@observer
class Footer extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            footer: getHeight($dom)
        });
    }

    render() {
        const {blocks, style} = this.props;

        return (
            <div className="gm-printer-footer">
                <div style={style}>
                    {_.map(blocks, (cell, i) => (
                        <div key={i} style={cell.style}>{printerStore.template(cell.text)}</div>
                    ))}
                </div>
            </div>
        );
    }
}

Footer.propTypes = {
    blocks: PropTypes.array.isRequired,
    style: PropTypes.object
};

export default Footer;