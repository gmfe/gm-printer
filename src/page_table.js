import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactDOM from "react-dom";
import {getHeight} from "./util";
import printerStore from "./store";

class Table extends React.Component {
    render() {
        const {columns, data} = this.props;

        return (
            <table className="gm-printer-table">
                <thead>
                <tr>
                    {_.map(columns, col => <th key={col.field} style={col.style}>{col.name}</th>)}
                </tr>
                </thead>
                <tbody>
                {_.map(data, (d, i) => {
                    return (
                        <tr key={i}>
                            {_.map(columns, col => <td
                                key={col.field}>{col.render ? col.render(d[col.field]) : d[col.field]}</td>)}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
}

class PageTable extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            table: true
        }, {
            table: getHeight($dom)
        });
    }

    render() {
        const {columns, data} = this.props;

        return (
            <div>
                <Table columns={columns} data={data}/>
            </div>
        );
    }
}

PageTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};

PageTable.defaultProps = {};

export default PageTable;