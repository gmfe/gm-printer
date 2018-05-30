import React from 'react';
import {getHeight} from "./util";
import printerStore from "./store";
import ReactDOM from "react-dom";

class PageFooter extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            footer: true
        }, {
            footer: getHeight($dom)
        });
    }

    render() {
        return (
            <div>PageFooter</div>
        );
    }
}

PageFooter.propTypes = {};

PageFooter.deaultProps = {};

export default PageFooter;