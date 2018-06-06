import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactDOM from "react-dom";
import {getHeight, getWidth} from "./util";
import printerStore from "./store";

class TableBefore extends React.Component {
    componentDidMount() {
        const {data} = this.props;

        const $table = ReactDOM.findDOMNode(this);
        const tHead = $table.querySelector('thead');
        const ths = tHead.querySelectorAll('th');
        const trs = $table.querySelectorAll('tbody tr');

        printerStore.setHeight({
            table: getHeight($table)
        });

        printerStore.setTable({
            data,
            head: {
                height: getHeight(tHead),
                widths: _.map(ths, th => getWidth(th))
            },
            body: {
                heights: _.map(trs, tr => getHeight(tr))
            }
        });
    }

    render() {
        const {columns, data} = this.props;

        return (
            <table className="gm-printer-table">
                <thead>
                <tr>
                    {_.map(columns, col => <th key={col.field} style={col.style}>{col.text}</th>)}
                </tr>
                </thead>
                <tbody>
                {_.map(data, (d, i) => (
                    <tr key={i}>
                        {_.map(columns, col => <td
                            key={col.field}>{col.render ? col.render(d[col.field]) : d[col.field]}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

class TableReady extends React.Component {
    render() {
        const {columns, data} = this.props;

        if (data.length === 0) {
            return null;
        }

        return (
            <table className="gm-printer-table">
                <thead>
                <tr>
                    {_.map(columns, (col, i) => <th key={col.field} style={Object.assign({}, col.style, {
                        width: printerStore.table.head.widths[i]
                    })}>{col.text}</th>)}
                </tr>
                </thead>
                <tbody>
                {_.map(data, (d, i) => (
                    <tr key={i}>
                        {_.map(columns, col => <td
                            key={col.field}>{col.render ? col.render(d[col.field]) : d[col.field]}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

class Table extends React.Component {
    render() {
        const {columns, data} = this.props;

        return (
            <div>
                {printerStore.ready ? <TableReady columns={columns} data={data}/> :
                    <TableBefore columns={columns} data={data}/>}
            </div>
        );
    }
}

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};

Table.defaultProps = {};

export default Table;