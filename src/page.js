import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import printerStore from './store';
import ReactDOM from "react-dom";
import {getHeight} from "./util";

@observer
class Page extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            page: getHeight($dom)
        });
    }

    render() {
        const {children} = this.props;
        const {top, right, bottom, left} = printerStore.gap;

        return (
            <div className="gm-printer-page" style={{
                width: `calc(${printerStore.size.width} - ${left} - ${right})`,
                height: `calc(${printerStore.size.height} - ${top} - ${bottom} - 3px)`,
                padding: `${top} ${right} ${bottom} ${left}`
            }}>
                <div className="gm-printer-page-inner" style={{
                    width: `calc(${printerStore.size.width} - ${left} - ${right})`,
                    height: `calc(${printerStore.size.height} - ${top} - ${bottom} - 3px)`
                }}>
                    {children}
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    pageIndex: PropTypes.number
};

Page.defaultProps = {};

export default Page;
