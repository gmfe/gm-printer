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
        const {disabled, value, block, style} = this.props;
        return (
            <input
                disabled={disabled}
                type="text"
                className={classNames({
                    'form-control': block
                })}
                value={value}
                onChange={this.handleChange}
                style={style}
            />
        );
    }
}

Text.propTypes = {
    disabled: PropTypes.bool,
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
        const {disabled, value = '', block} = this.props;

        let nValue = value;
        if (value.endsWith('px')) {
            nValue = value.replace(/px/g, '');
        }

        return (
            <Text disabled={disabled} block={block} value={nValue} onChange={this.handleChange}
                  style={{width: '50px'}}/>
        );
    }
}

TextPX.propTypes = {
    disabled: PropTypes.bool,
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
    handleChange = (value) => {
        const {onChange} = this.props;
        onChange(value);
    };

    render() {
        const {value} = this.props;
        return (
            <span className="gm-printer-config-text-align">
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'left'
                    })}
                    onClick={() => this.handleChange('left')}
                ><i className="glyphicon glyphicon-align-left"/></span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'center'
                    })}
                    onClick={() => this.handleChange('center')}
                ><i className="glyphicon glyphicon-align-center"/></span>
                <span
                    className={classNames("gm-printer-config-btn", {
                        active: value === 'right'
                    })}
                    onClick={() => this.handleChange('right')}
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
        const {style, onChange} = this.props;

        const map = {
            left: 'right',
            right: 'left',
            top: 'bottom',
            bottom: 'top'
        };

        onChange({
            ...style,
            [type]: value,
            [map[type]]: ''
        });
    };

    render() {
        const {style: {top, right, bottom, left}} = this.props;

        return (
            <span>
                上 <TextPX value={top} onChange={this.handleChange.bind(this, 'top')}/>
                &nbsp;
                左 <TextPX value={left} onChange={this.handleChange.bind(this, 'left')}/>
                &nbsp;
                下 <TextPX value={bottom} onChange={this.handleChange.bind(this, 'bottom')}/>
                &nbsp;
                右 <TextPX value={right} onChange={this.handleChange.bind(this, 'right')}/>
            </span>
        );
    }
}

Position.propTypes = {
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

class Gap extends React.Component {
    handleChange = (type, value) => {
        const {style, onChange} = this.props;

        onChange({
            ...style,
            [type]: value
        });
    };

    render() {
        const {disabled, style: {paddingTop, paddingRight, paddingBottom, paddingLeft}} = this.props;

        return (
            <span>
                上 <TextPX disabled={disabled} value={paddingTop} onChange={this.handleChange.bind(this, 'paddingTop')}/>
                &nbsp;
                左 <TextPX disabled={disabled} value={paddingLeft}
                          onChange={this.handleChange.bind(this, 'paddingLeft')}/>
                &nbsp;
                下 <TextPX disabled={disabled} value={paddingBottom}
                          onChange={this.handleChange.bind(this, 'paddingBottom')}/>
                &nbsp;
                右 <TextPX disabled={disabled} value={paddingRight}
                          onChange={this.handleChange.bind(this, 'paddingRight')}/>
            </span>
        );
    }
}

Gap.propTypes = {
    disabled: PropTypes.bool,
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

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
    };

    render() {
        const {disabled, style, size, font, gap, position} = this.props;

        return (
            <div>
                {size && (
                    <div>
                        大小: 高 <TextPX disabled={disabled} value={style.height}
                                      onChange={this.handleChange.bind(this, 'height')}/>
                        &nbsp;
                        宽 <TextPX disabled={disabled} value={style.width}
                                  onChange={this.handleChange.bind(this, 'width')}/>
                    </div>
                )}
                {font && (
                    <div>
                        格式: <Fonter style={style} onChange={this.handleStyle}/>
                        <TextAlign value={style.textAlign}
                                   onChange={this.handleChange.bind(this, 'textAlign')}/>
                    </div>
                )}
                {gap && (
                    <div>
                        边距: <Gap disabled={disabled} style={style} onChange={this.handleStyle}/>
                    </div>
                )}
                {position && (
                    <div>
                        位置: <Position style={style} onChange={this.handleStyle}/>
                    </div>
                )}
            </div>
        );
    }
}

Style.propTypes = {
    disabled: PropTypes.bool,
    style: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.bool,
    font: PropTypes.bool,
    gap: PropTypes.bool,
    position: PropTypes.bool
};

export {
    Style,
    Text
};
