import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import printerStore from './store';
import {getHeight} from './util';

@observer
class Title extends React.Component {
    componentDidMount() {
        const $dom = ReactDOM.findDOMNode(this);

        printerStore.setHeight({
            title: getHeight($dom)
        });
    }

    render() {
        const {text, style} = this.props;
        return (
            <div>
                <div style={style}>
                    {printerStore.template(text)}
                </div>
            </div>
        );
    }
}

Title.propTypes = {
    text: PropTypes.string.isRequired,
    style: PropTypes.object
};

Title.defaultProps = {};

export default Title;