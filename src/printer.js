import React from 'react';
import {observer} from 'mobx-react';
import PropTypes from "prop-types";
import printerStore from "./store";
import Page from './page';
import _ from 'lodash';
import Title from './title';
import Top from './top';
import Bottom from './bottom';
import Header from './header';
import Footer from './footer';
import Fixed from './fixed';
import Table from "./table";


@observer
class Printer extends React.Component {
    constructor(props) {
        super(props);

        printerStore.setSize(props.size);
        printerStore.setGap(props.gap);

        printerStore.setData(props.data);
        printerStore.setTableData(props.tableData);
    }

    componentDidMount() {
        printerStore.setReady(true);

        printerStore.setPage();
    }

    renderBefore() {
        const {config, tableData} = this.props;

        return (
            <Page>
                <Title {...config.title}/>
                <Header {...config.header}/>
                <Top {...config.top}/>
                <Table {...config.table} data={tableData}/>
                <Bottom {...config.bottom}/>
                <Footer {...config.footer} pageIndex={0}/>
                <Fixed {...config.fixed}/>
            </Page>
        );
    }

    renderOnePage() {
        const {config, tableData} = this.props;

        return (
            <Page pageIndex={0}>
                <Title {...config.title}/>
                <Header {...config.header}/>
                <Top {...config.top}/>
                <Table {...config.table} data={tableData}/>
                <Bottom {...config.bottom}/>
                <Footer {...config.footer} pageIndex={0}/>
                <Fixed {...config.fixed}/>
            </Page>
        );
    }

    renderMorePage() {
        const {
            config, tableData
        } = this.props;

        return (
            <React.Fragment>
                {_.map(printerStore.page, (p, i) => {

                    if (p.bottomPage) {
                        return (
                            <Page key={i} pageIndex={i}>
                                <Title {...config.title}/>
                                <Header {...config.header}/>
                                <Bottom {...config.bottom}/>
                                <Footer {...config.footer} pageIndex={i}/>
                                <Fixed {...config.fixed}/>
                            </Page>
                        );
                    }

                    return (
                        <Page key={i} pageIndex={i}>
                            <Title {...config.title}/>
                            <Header {...config.header}/>
                            {i === 0 ? <Top {...config.top}/> : null}
                            <Table {...config.table} data={tableData.slice(p.begin, p.end)}/>
                            {i === (printerStore.page.length - 1) ? <Bottom {...config.bottom}/> : null}
                            <Footer {...config.footer} pageIndex={i}/>
                            <Fixed {...config.fixed}/>
                        </Page>
                    );
                })}
            </React.Fragment>
        );
    }

    renderPage() {
        const pageLength = printerStore.page.length;
        if (pageLength === 1) {
            return this.renderOnePage();
        } else {
            return this.renderMorePage();
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
    data: PropTypes.object.isRequired,
    tableData: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,

    size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gap: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

Printer.defaultProps = {
    size: 'A4',
    gap: 'A4'
};

export default Printer;