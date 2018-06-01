import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';

@observer
class PageHeader extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            header: true
        }, {
            header: getHeight($dom)
        });
    }

    render() {
        return (
            <div>
                <div style={{background: 'red', height: '100px'}}>PageHeader</div>
            </div>
        );
    }
}

PageHeader.propTypes = {};

PageHeader.defaultProps = {};

export default PageHeader;