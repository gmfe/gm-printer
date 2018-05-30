import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';

@observer
class PageTop extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            top: true
        }, {
            top: getHeight($dom)
        });
    }

    render() {
        return (
            <div>
                <h1>Title</h1>
            </div>
        );
    }
}

PageTop.propTypes = {};

PageTop.deaultProps = {};

export default PageTop;