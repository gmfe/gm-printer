import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';
import PropTypes from "prop-types";
import _ from "lodash";

@observer
class Top extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            top: getHeight($dom)
        });
    }

    render() {
        const {blocks, style} = this.props;

        return (
            <div className="gm-printer-top">
                <div style={style}>
                    {_.map(blocks, (cell, i) => (
                        <div key={i} style={cell.style}>{printerStore.template(cell.text)}</div>
                    ))}
                </div>
            </div>
        );
    }
}

Top.propTypes = {
    blocks: PropTypes.array.isRequired,
    style: PropTypes.object
};

export default Top;