import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';

@observer
class PageTop extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            top: getHeight($dom)
        });
    }

    render() {
        return (
            <div>
                <div style={{height: '50px'}}>Top</div>
            </div>
        );
    }
}

PageTop.propTypes = {};

PageTop.defaultProps = {};

export default PageTop;