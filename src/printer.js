import React from 'react';
import {observer} from 'mobx-react';
import PropTypes from "prop-types";
import printerStore from "./store";
import Page from './page';
import _ from 'lodash';

@observer
class Printer extends React.Component {
    constructor(props) {
        super(props);

        printerStore.setSize(props.size);
        printerStore.setGap(props.gap);
    }

    componentDidMount() {
        printerStore.setReady(true);

        printerStore.setPage();
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
            <Page pageIndex={0}>
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

    renderTwoPage() {
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
            <React.Fragment>
                {_.map(printerStore.page, (p, i) => (
                    <Page key={i} pageIndex={i}>
                        {i === 0 ? title : null}
                        {header}
                        {i === 0 ? top : null}
                        {React.cloneElement(table, {
                            ...table.props,
                            data: table.props.data.slice(p.begin, p.end)
                        })}
                        {i === (printerStore.page.length - 1) ? bottom : null}
                        {footer}
                        {fixed}
                    </Page>
                ))}
            </React.Fragment>
        );
    }

    renderPage() {
        const pageLength = printerStore.page.length;
        if (pageLength === 1) {
            return this.renderOnePage();
        } else {
            return this.renderTwoPage();
        }
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