import React from 'react';
import PropTypes from "prop-types";
import printerStore from "./store";

class Printer extends React.Component {
    constructor(props) {
        super(props);

        printerStore.setSize(props.size);
        printerStore.setGap(props.gap);
    }

    render() {
        const {children} = this.props;

        return (
            <div className="gm-printer" style={{
                width: printerStore.size.width,
                height: printerStore.size.height
            }}>
                {children}
            </div>
        );
    }
}

Printer.propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gap: PropTypes.object
};

Printer.deaultProps = {
    size: 'A4',
    gap: {
        top: '5mm',
        right: '5mm',
        bottom: '5mm',
        left: '5mm'
    }
};

export default Printer;