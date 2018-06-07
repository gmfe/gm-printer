import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

class Panel extends React.Component {
    render() {
        const {title, children} = this.props;

        return (
            <div className="gm-padding-5 gm-margin-5" style={{border: '1px solid black'}}>
                <div className="gm-border-bottom">
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

class Text extends React.Component {
    handleChange = (e) => {
        const {onChange} = this.props;
        onChange(e.target.value);
    };

    render() {
        const {value} = this.props;
        return (
            <input type="text" className="form-control" value={value} onChange={this.handleChange}
                   placeholder="请输入"/>
        );
    }
}

Text.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

class Number extends React.Component {
    handleChange = (e) => {
        const {onChange} = this.props;
        onChange(e.target.value);
    };

    render() {
        const {value} = this.props;
        return (
            <input type="number" value={value} onChange={this.handleChange}
                   style={{width: '100px'}}/>
        );
    }
}

Number.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};


class Position extends React.Component {
    handleChange = (type, value) => {
        const {onChange, style} = this.props;
        onChange({
            ...style,
            [type]: value
        });
    };

    render() {
        const {style: {top, right, bottom, left}} = this.props;

        return (
            <div onChange={this.handleChange}>
                <div className="text-center">
                    上 <Number value={top} onChange={this.handleChange.bind(this, 'top')}/>
                </div>
                <div className="text-center">
                    左 <Number value={left} onChange={this.handleChange.bind(this, 'left')}/>
                    <Number value={right} onChange={this.handleChange.bind(this, 'right')}/> 右
                </div>
                <div className="text-center">
                    下 <Number value={bottom} onChange={this.handleChange.bind(this, 'bottom')}/>
                </div>
            </div>
        );
    }
}

class Style extends React.Component {
    handleChange = (type, value) => {
        const {onChange, style} = this.props;

        onChange({
            ...style,
            [type]: value
        });
    };

    render() {
        const {style: {height}} = this.props;

        return (
            <div>
                <div>
                    高 <Number value={height} onChange={this.handleChange.bind(this, 'height')}/>
                </div>
            </div>
        );
    }
}

Style.propTypes = {
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    fontSize: PropTypes.bool,
    height: PropTypes.bool
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
                    <div key={i} className="gm-padding-tb-5 gm-padding-left-15 gm-margin-tb-5"
                         style={{borderTop: '1px dotted black'}}>
                        <Text value={block.text} onChange={this.handleBlockText.bind(this, i)}/>
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
                <Text value={data.text} onChange={this.handleText}/>
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
    PanelBlock,
    PanelTitle,
    Panel
};
