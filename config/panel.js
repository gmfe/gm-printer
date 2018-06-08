import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import {Text, Style, Position} from './util';

class Panel extends React.Component {
    render() {
        const {title, children} = this.props;

        return (
            <div className="gm-padding-5 gm-margin-10" style={{border: '1px solid black', position: 'relative'}}>
                <div style={{position: 'absolute', top: '-8px', background: 'white', padding: '0 5px'}}>
                    {title}
                </div>
                <div className="gm-padding-tb-5">
                    {children}
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    title: PropTypes.string.isRequired
};

class PanelBlock extends React.Component {
    handleBlockText = (index, text) => {
        const {data, onUpdate} = this.props;

        data.blocks[index].text = text;

        onUpdate(data);
    };

    handleBlockStyle = (index, style) => {
        const {data, onUpdate} = this.props;

        data.blocks[index].style = style;

        onUpdate(data);
    };

    handleStyle = (style) => {
        const {data, onUpdate} = this.props;

        onUpdate({
            ...data,
            style
        });
    };

    render() {
        const {title, data} = this.props;

        return (
            <Panel title={title}>
                <Style style={data.style} onChange={this.handleStyle}/>
                {_.map(data.blocks, (block, i) => (
                    <div key={i} className="gm-padding-tb-5 gm-padding-left-10 gm-margin-tb-5"
                         style={{borderTop: '1px dotted black'}}>
                        <Text block value={block.text} onChange={this.handleBlockText.bind(this, i)}/>
                        <Position style={block.style} onChange={this.handleBlockStyle.bind(this, i)}/>
                        <Style style={block.style} onChange={this.handleBlockStyle.bind(this, i)}/>
                    </div>
                ))}
            </Panel>
        );
    }
}

PanelBlock.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onUpdate: PropTypes.func.isRequired
};

class PanelTitle extends React.Component {
    handleText = (text) => {
        const {data, onUpdate} = this.props;
        onUpdate({
            ...data,
            text
        });
    };

    handleStyle = (style) => {
        const {data, onUpdate} = this.props;
        onUpdate({
            ...data,
            style
        });
    };

    render() {
        const {title, data} = this.props;

        return (
            <Panel title={title}>
                <Text block value={data.text} onChange={this.handleText}/>
                <Style style={data.style} onChange={this.handleStyle}/>
            </Panel>
        );
    }
}

PanelTitle.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export {
    Panel,
    PanelBlock,
    PanelTitle
};
