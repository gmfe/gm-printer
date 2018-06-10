import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import {Flex} from 'react-gm';
import {Text, Style} from './util';
import {pageSizeMap} from '../printer/util';

class Panel extends React.Component {
    render() {
        const {title, children} = this.props;

        return (
            <div className="gm-padding-5 gm-margin-10" style={{border: '1px solid black', position: 'relative'}}>
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    background: 'white',
                    padding: '0 5px',
                    fontWeight: 'bolder'
                }}>
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

class PanelPage extends React.Component {
    handleChange = (type, value) => {
        const {data, onUpdate} = this.props;

        if (type === 'type') {
            onUpdate({
                [type]: value,
                ...pageSizeMap[value]
            });
        } else {
            onUpdate({
                ...data,
                [type]: value
            });
        }
    };

    render() {
        const {title, data} = this.props;

        return (
            <Panel title={title}>
                <div>
                    纸张
                    <select value={data.type} onChange={(e) => this.handleChange('type', e.target.value)}>
                        {_.map(pageSizeMap, (value, key) => <option value={key} key={key}>{key}</option>)}
                        <option value="">自定义</option>
                    </select>
                </div>
                {(
                    <div>
                        <Style disabled={!!data.type} size style={data.size}
                               onChange={this.handleChange.bind(this, 'size')}/>
                        <Style disabled={!!data.type} gap style={data.gap}
                               onChange={this.handleChange.bind(this, 'gap')}/>
                    </div>
                )}
            </Panel>
        );
    }
}

PanelPage.propTypes = {
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
                <Style size font gap style={data.style} onChange={this.handleStyle}/>
            </Panel>
        );
    }
}

PanelTitle.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onUpdate: PropTypes.func.isRequired
};

class PanelBlock extends React.Component {
    handleBlock = (index, type, value) => {
        const {data, onUpdate} = this.props;

        data.blocks[index][type] = value;

        onUpdate(data);
    };

    handleStyle = (style) => {
        const {data, onUpdate} = this.props;

        onUpdate({
            ...data,
            style
        });
    };

    handleRemove(index) {
        const {data, onUpdate} = this.props;
        _.remove(data.blocks, (v, i) => i === index);
        onUpdate(data);
    }

    handleAdd = () => {
        const {data, onUpdate} = this.props;
        data.blocks.push({
            text: '请编辑',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px'
            }
        });
        onUpdate(data);
    };

    handleAddImage = () => {
        const {data, onUpdate} = this.props;
        data.blocks.push({
            type: 'image',
            link: '填写链接',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px'
            }
        });
        onUpdate(data);
    };

    render() {
        const {title, data, addTypes} = this.props;

        return (
            <Panel title={title}>
                {data.style && <Style size style={data.style} onChange={this.handleStyle}/>}
                {data.style && <div className="gm-margin-top-5" style={{
                    borderTop: '1px solid black'
                }}/>}
                <div>
                    {_.map(data.blocks, (block, i) => {
                        if (block.type === 'image') {
                            return (
                                <div
                                    key={i}
                                    className="gm-padding-tb-5 gm-margin-tb-5 gm-position-relative"
                                    style={{borderBottom: '1px dotted black'}}
                                >
                                    <div className="clearfix">
                                        <strong>图片</strong>
                                        <button type="button" className="close"
                                                onClick={this.handleRemove.bind(this, i)}>&times;</button>
                                    </div>
                                    <Text block value={block.link} onChange={this.handleBlock.bind(this, i, 'link')}/>
                                    <Style size position style={block.style}
                                           onChange={this.handleBlock.bind(this, i, 'style')}/>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={i}
                                    className="gm-padding-tb-5 gm-margin-tb-5 gm-position-relative"
                                    style={{borderBottom: '1px dotted black'}}
                                >
                                    <div className="clearfix">
                                        <strong>文本</strong>
                                        <button type="button" className="close"
                                                onClick={this.handleRemove.bind(this, i)}>&times;</button>
                                    </div>
                                    <Text block value={block.text} onChange={this.handleBlock.bind(this, i, 'text')}/>
                                    <Style font position style={block.style}
                                           onChange={this.handleBlock.bind(this, i, 'style')}/>

                                </div>
                            );
                        }
                    })}
                    <div className="text-right">
                        <button type="button" onClick={this.handleAdd}>+</button>
                        {addTypes.includes('image') && (
                            <button type="button" onClick={this.handleAddImage}>+ 图片</button>
                        )}
                    </div>
                </div>
            </Panel>
        );
    }
}

PanelBlock.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onUpdate: PropTypes.func.isRequired,
    addTypes: PropTypes.array
};

PanelBlock.defaultProps = {
    addTypes: []
};

class PanelColumns extends React.Component {
    handleChange = (index, type, value) => {
        const {data, onUpdate} = this.props;

        data.columns[index][type] = value;

        onUpdate(data);
    };

    handleRemove = (index) => {
        const {data, onUpdate} = this.props;
        _.remove(data.columns, (v, i) => i === index);
        onUpdate(data);
    };

    handleAdd = () => {
        const {data, onUpdate} = this.props;
        data.columns.push({
            head: '请编辑',
            headStyle: {
                textAlign: 'center'
            },
            text: '请编辑',
            style: {
                textAlign: 'center'
            }
        });
        onUpdate(data);
    };

    render() {
        const {title, data} = this.props;

        return (
            <Panel title={title}>
                {_.map(data.columns, (col, i) => (
                    <div
                        key={i}
                        className="gm-padding-tb-5 gm-margin-tb-5 gm-position-relative"
                        style={{borderBottom: '1px dotted black'}}
                    >
                        <div className="clearfix">
                            <button type="button" className="close"
                                    onClick={this.handleRemove.bind(this, i)}>&times;</button>
                        </div>
                        <Flex>
                            表头:
                            <Flex column flex>
                                <Text block value={col.head} onChange={this.handleChange.bind(this, i, 'head')}/>
                                <Style font style={col.headStyle}
                                       onChange={this.handleChange.bind(this, i, 'headStyle')}/>
                            </Flex>
                        </Flex>
                        <Flex>
                            内容:
                            <Flex column flex>
                                <Text block value={col.text} onChange={this.handleChange.bind(this, i, 'text')}/>
                                <Style font style={col.style} onChange={this.handleChange.bind(this, i, 'style')}/>
                            </Flex>
                        </Flex>
                    </div>
                ))}
                <div className="text-right">
                    <button type="button" onClick={this.handleAdd}>+</button>
                </div>
            </Panel>
        );
    }
}

PanelColumns.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export {
    PanelTitle,
    PanelBlock,
    PanelColumns,
    PanelPage
};
