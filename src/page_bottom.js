import React from 'react';
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";

class PageBottom extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            bottom: true
        }, {
            bottom: getHeight($dom)
        });
    }

    render() {
        return (
            <div>PageBottom</div>
        );
    }
}

PageBottom.propTypes = {};

PageBottom.defaultProps = {};

export default PageBottom;