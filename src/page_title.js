import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';

@observer
class PageTitle extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setReady({
            title: true
        }, {
            title: getHeight($dom)
        });
    }

    render() {
        return (
            <div>
                <div style={{background: 'blue', height: '100px'}}>
                    <div>配送单</div>
                </div>
            </div>
        );
    }
}

PageTitle.propTypes = {};

PageTitle.defaultProps = {};

export default PageTitle;