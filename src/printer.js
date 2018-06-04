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
        printerStore.setReady(true);

    }

    renderBefore() {
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

    renderPage() {

    }

    render() {
        return (
            <div className="gm-printer" style={{
                width: printerStore.size.width
            }}>
                {printerStore.ready ? this.renderPage() : this.renderBefore()}
            </div>
        );
    }
}

Printer.propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gap: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

Printer.defaultProps = {
    size: 'A4',
    gap: 'A4'
};

export default Printer;