import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import _ from 'lodash';

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

// 10px => 10  10% => 10%
class TextPX extends React.Component {
    handleChange = (value) => {
        const {onChange} = this.props;
        if (value === '') {
            onChange('');
        } else if (value.endsWith('%')) {
            onChange(value);
        } else {
            onChange(value + 'px');
        }
    };

    render() {
        const {value = '', block} = this.props;

        let nValue = value;
        if (value.endsWith('px')) {
            nValue = value.replace(/px/g, '');
        }

        return (
            <Text block={block} value={nValue} onChange={this.handleChange}/>
        );
    }
}

TextPX.propTypes = {
    block: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

const fontSizeList = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
    '26px',
    '28px'
];

class Fonter extends React.Component {
    handleChange = (type, value) => {
        const {style, onChange} = this.props;

        onChange({
            ...style,
            [type]: value
        });
    };

    render() {
        const {style} = this.props;

        return (
            <span className="gm-printer-config-fonter">
                <select
                    value={style.fontSize}
                    onChange={e => this.handleChange('fontSize', e.target.value)}
                >
                    {_.map(fontSizeList, v => <option key={v} value={v}>{v.slice(0, -2)}</option>)}
                </select>
                &nbsp;
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: style.fontWeight === 'bold'
                    })}
                    style={{fontWeight: 'bold'}}
                    onClick={() => this.handleChange('fontWeight', style.fontWeight === 'bold' ? '' : 'bold')}
                >
                    B
                </span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: style.fontStyle === 'italic'
                    })}
                    style={{fontStyle: 'italic'}}
                    onClick={() => this.handleChange('fontStyle', style.fontStyle === 'italic' ? '' : 'italic')}
                >
                    I
                </span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: style.textDecoration === 'underline'
                    })}
                    style={{textDecoration: 'underline'}}
                    onClick={() => this.handleChange('textDecoration', style.textDecoration === 'underline' ? '' : 'underline')}
                >
                    U
                </span>
            </span>
        );
    }
}

Fonter.propTypes = {
    // fontSize: PropTypes.string,
    // fontWeight: PropTypes.string,
    // fontStyle: PropTypes.string,
    // textDecoration: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
};

class TextAlign extends React.Component {
    render() {
        const {value} = this.props;
        return (
            <span className="gm-printer-config-text-align">
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'left'
                    })}
                ><i className="glyphicon glyphicon-align-left"/></span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'center'
                    })}
                ><i className="glyphicon glyphicon-align-center"/></span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'right'
                    })}
                ><i className="glyphicon glyphicon-align-right"/></span>
            </span>
        );
    }
}

TextAlign.propTypes = {
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
                    上 <TextPX value={top} onChange={this.handleChange.bind(this, 'top')}/>
                </div>
                <div className="text-center">
                    左 <TextPX value={left} onChange={this.handleChange.bind(this, 'left')}/>
                    <TextPX value={right} onChange={this.handleChange.bind(this, 'right')}/> 右
                </div>
                <div className="text-center">
                    下 <TextPX value={bottom} onChange={this.handleChange.bind(this, 'bottom')}/>
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

    handleStyle = (style) => {
        const {onChange} = this.props;
        onChange(style);
        console.log(style);
    };

    render() {
        const {style} = this.props;

        return (
            <div>
                <div>
                    高 <TextPX value={style.height} onChange={this.handleChange.bind(this, 'height')}/>
                </div>
                <div>
                    宽 <TextPX value={style.width} onChange={this.handleChange.bind(this, 'width')}/>
                </div>
                <div>
                    字 <Fonter style={style} onChange={this.handleStyle}/> <TextAlign value={style.textAlign}
                                                                                     onChange={this.handleChange.bind(this, 'textAlign')}/>
                </div>
                <div>
                    边距 <TextPX value={style.padding} onChange={this.handleChange.bind(this, 'padding')}/>
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

export {
    Style,
    Position,
    Text
};
