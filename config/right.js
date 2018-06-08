import React from 'react';
import PropTypes from 'prop-types';
import {PanelBlock, PanelTitle, Panel} from './util';

class Right extends React.Component {

    handleUpdate = (key, data) => {
        const {config, onUpdate} = this.props;
        onUpdate({
            ...config,
            [key]: data
        });
    };

    render() {
        const {config} = this.props;

        return (
            <div>
                <PanelTitle title="标题" data={config.title} onUpdate={this.handleUpdate.bind(this, 'title')}/>
                <PanelBlock title="页眉" data={config.header} onUpdate={this.handleUpdate.bind(this, 'header')}/>
                <PanelBlock title="头部" data={config.top} onUpdate={this.handleUpdate.bind(this, 'top')}/>
                <Panel title="表格数据" data={config.table} onUpdate={this.handleUpdate.bind(this, 'table')}/>
                <PanelBlock title="底部" data={config.bottom} onUpdate={this.handleUpdate.bind(this, 'bottom')}/>
                <PanelBlock title="页脚" data={config.footer} onUpdate={this.handleUpdate.bind(this, 'footer')}/>
            </div>
        );
    }
}

Right.propTypes = {
    config: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
};

Right.deaultProps = {};

export default Right;