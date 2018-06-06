import React from 'react';
import ReactDOM from 'react-dom';
import Printer from '../src/index';
import '../src/style.less';
import 'normalize.css/normalize.css';
import config from './config';
import data from './data';
import moment from 'moment';

const nData = {
    ...data,

    receive_begin_time_t1: moment(data.receive_begin_time).format('MM-DD HH:mm'),
    receive_end_time_t1: moment(data.receive_end_time).format('MM-DD HH:mm')
};

class App extends React.Component {
    render() {
        return (
            <div>
                <Printer
                    data={nData}
                    tableData={nData.details}
                    config={config}
                />
            </div>
        );
    }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'));