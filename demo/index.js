import React from 'react';
import ReactDOM from 'react-dom';
import config from '../demo/config';
import data from '../demo/data';
import moment from 'moment';
import {Flex} from 'react-gm';
import '../node_modules/react-gm/src/index.less';
import 'normalize.css/normalize.css';
import Right from './right';

const nData = {
    ...data,

    receive_begin_time_t1: moment(data.receive_begin_time).format('MM-DD HH:mm'),
    receive_end_time_t1: moment(data.receive_end_time).format('MM-DD HH:mm')
};

class App extends React.Component {
    componentDidMount() {


        const $iframe = ReactDOM.findDOMNode(this.refIframe);
        window.$iframe = $iframe;

        const script = $iframe.contentWindow.document.createElement('script');
        script.src = '/lib.bundle.js';
        $iframe.contentWindow.document.body.append(script);

        script.addEventListener('load', () => {
            $iframe.contentWindow.render({
                data: nData,
                tableData: nData.details,
                config
            });
        });
    }

    render() {
        return (
            <Flex>
                <Flex flex column style={{minWidth: '850px', height: '100vh'}}>
                    <iframe
                        ref={ref => this.refIframe = ref}
                        style={{border: 'none', width: '100%', height: '1000px'}}
                    />
                </Flex>
                <div style={{width: '400px'}}>
                    <Right config={config}/>
                </div>
            </Flex>
        );
    }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'));
