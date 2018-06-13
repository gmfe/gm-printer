import React from 'react';
import ReactDOM from 'react-dom';
import Printer from './printer';
import 'normalize.css/normalize.css';
import './style.less';
import _ from 'lodash';

const div = window.document.createElement('div');
div.id = 'appContainer';
window.document.body.appendChild(div);

const style = window.document.createElement('style');
style.type = 'text/css';
window.document.head.appendChild(style);

function addPageSizeStyle(rule) {
    style.sheet.insertRule(`@page {size: ${rule}; }`);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        const {type, size} = props.config.page;
        if (type) {
            addPageSizeStyle(type);
        } else {
            addPageSizeStyle(`${size.width} ${size.height}`);
        }
    }

    render() {
        const {
            data, tableData,
            config,
            datas, tableDatas,
            isBatch
        } = this.props;

        if (isBatch) {
            return (
                <div>
                    {_.map(datas, (v, i) => <Printer
                        key={i}
                        data={datas[i]}
                        tableData={tableDatas[i]}
                        config={config}
                    />)}
                </div>
            );
        } else {
            return (
                <Printer
                    data={data}
                    tableData={tableData}
                    config={config}
                />
            );
        }
    }
}

window.render = (props) => {
    // 给随机数key，避免不render
    ReactDOM.render(<App key={Math.random()} {...props}/>, div);
};

window.renderBatch = (props) => {
    // 给随机数key，避免不render
    ReactDOM.render(<App key={Math.random()} {...props} isBatch/>, div);
};