import React from 'react';
import ReactDOM from 'react-dom';
import config from '../demo/config';
import data from '../demo/data';
import moment from 'moment';
import '../node_modules/react-gm/src/index.less';
import 'normalize.css/normalize.css';
import Config from '../config';

const nData = {
    ...data,

    receive_begin_time_t1: moment(data.receive_begin_time).format('MM-DD HH:mm'),
    receive_end_time_t1: moment(data.receive_end_time).format('MM-DD HH:mm')
};

class App extends React.Component {

    render() {
        return (
            <div style={{height: '100vh', width: '100vw'}}>
                <Config data={nData} config={config} tableData={nData.details}/>
            </div>
        );
    }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'));
