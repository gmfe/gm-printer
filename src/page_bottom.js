import React from 'react';
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";

class PageBottom extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            bottom: getHeight($dom)
        });
    }

    render() {
        return (
            <div className="gm-printer-bottom" style={{
                background: 'green',
                height: '400px'
            }}>PageBottom</div>
        );
    }
}

PageBottom.propTypes = {};

PageBottom.defaultProps = {};

export default PageBottom;