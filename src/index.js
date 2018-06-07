import React from 'react';
import ReactDOM from 'react-dom';
import Printer from './printer';
import '../src/style.less';
import 'normalize.css/normalize.css';

const div = window.document.createElement('div');
div.id = 'appContainer';
window.document.body.appendChild(div);

class App extends React.Component {
    render() {
        const {data, tableData, config} = this.props;
        return (
            <Printer
                data={data}
                tableData={tableData}
                config={config}
            />
        );
    }
}

window.render = (props) => {
    // 给随机数key，避免不render
    ReactDOM.render(<App key={Math.random()} {...props}/>, div);
};