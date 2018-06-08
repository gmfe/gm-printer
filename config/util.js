import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import classNames from 'classnames';

class Panel extends React.Component {
    render() {
        const {title, children} = this.props;

        return (
            <div className="gm-padding-5 gm-margin-10" style={{border: '1px solid black', position: 'relative'}}>
                <div style={{position: 'absolute', top: '-6px', background: 'white', padding: '0 5px'}}>
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
        const {value, block} = this.props;
        return (
            <input type="text" className={classNames({
                'form-control': block
            })} value={value} onChange={this.handleChange}
                   placeholder="请输入"/>
        );
    }
}

Text.propTypes = {
    block: PropTypes.bool,
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
        const {
            style: {
                height, width,
                padding,
                fontSize, fontWeight,
                textAlign
            }
        } = this.props;

        console.log(this.props.style);

        return (
            <div>
                <div>
                    高 <Number value={height} onChange={this.handleChange.bind(this, 'height')}/>
                </div>
                <div>
                    宽 <Number value={width} onChange={this.handleChange.bind(this, 'width')}/>
                </div>
                <div>
                    对齐 <Text value={textAlign} onChange={this.handleChange.bind(this, 'textAlign')}/>
                </div>
                <div>
                    字体大小 <Number value={fontSize} onChange={this.handleChange.bind(this, 'fontSize')}/>
                </div>
                <div>
                    字体粗细 <Text value={fontWeight} onChange={this.handleChange.bind(this, 'fontWeight')}/>
                </div>
                <div>
                    边距 <Number value={padding} onChange={this.handleChange.bind(this, 'padding')}/>
                </div>

            </div>
        );
    }
}

Style.propTypes = {
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    fontSize: PropTypes.bool,
    fontWeight: PropTypes.bool,
    textAlign: PropTypes.bool,
    padding: PropTypes.bool,
    height: PropTypes.bool,
    width: PropTypes.bool
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
    PanelBlock,
    PanelTitle,
    Panel
};
