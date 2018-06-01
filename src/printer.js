import React from 'react';
import PropTypes from "prop-types";
import printerStore from "./store";
import Page from './page';

class Printer extends React.Component {
    constructor(props) {
        super(props);

        printerStore.setSize(props.size);
        printerStore.setGap(props.gap);
    }

    componentDidMount() {
        console.log(printerStore.computedHeight);
    }

    renderOnePage() {
        const {
            title,
            header,
            top,
            table,
            bottom,
            footer,
            fixed
        } = this.props;

        return (
            <Page>
                {title}
                {header}
                {top}
                {table}
                {bottom}
                {footer}
                {fixed}
            </Page>
        );
    }

    render() {
        return (
            <div className="gm-printer" style={{
                width: printerStore.size.width
            }}>
                {this.renderOnePage()}
            </div>
        );
    }
}

Printer.propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gap: PropTypes.object
};

Printer.defaultProps = {
    size: 'A4',
    gap: {
        top: '5mm',
        right: '5mm',
        bottom: '5mm',
        left: '5mm'
    }
};

export default Printer;