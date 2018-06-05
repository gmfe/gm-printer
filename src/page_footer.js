import React from 'react';
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";

class PageFooter extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            footer: getHeight($dom)
        });
    }

    render() {
        return (
            <div className="gm-printer-footer" style={{height: '100px', background: 'rgba(0,0,0,.1)'}}>PageFooter</div>
        );
    }
}

PageFooter.propTypes = {};

PageFooter.defaultProps = {};

export default PageFooter;