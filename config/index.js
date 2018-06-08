import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Flex} from 'react-gm';
import '../node_modules/react-gm/src/index.less';
import 'normalize.css/normalize.css';
import Right from './right';

class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config
        };

        this.debounceDoRender = _.debounce(this.doRender, 1000);
    }

    componentDidMount() {
        const $iframe = ReactDOM.findDOMNode(this.refIframe);
        window.$iframe = $iframe;
        this.$iframe = $iframe;

        const script = $iframe.contentWindow.document.createElement('script');
        script.src = '/lib.bundle.js';
        $iframe.contentWindow.document.body.append(script);

        script.addEventListener('load', () => {
            this.doRender();
        });
    }

    doRender = () => {
        const {config} = this.state;
        const {data, tableData} = this.props;
        this.$iframe.contentWindow.render({
            data,
            tableData,
            config
        });
    };

    handleUpdate = (config) => {
        this.setState({
            config
        }, () => {
            this.debounceDoRender();
        });
    };

    render() {
        const {config} = this.state;

        return (
            <Flex style={{height: '100%', width: '100%'}}>
                <Flex flex column style={{minWidth: '850px'}}>
                    <iframe
                        ref={ref => this.refIframe = ref}
                        style={{border: 'none', width: '100%', height: '100%'}}
                    />
                </Flex>
                <Flex column style={{width: '350px', minWidth: '350px'}} className="gm-overflow-y">
                    <Right config={config} onUpdate={this.handleUpdate}/>
                </Flex>
            </Flex>
        );
    }
}

Config.propTypes = {
    data: PropTypes.object.isRequired,
    tableData: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired
};

export default Config;
