import React from 'react';
import PropTypes from 'prop-types';

class Panel extends React.Component {
    render() {
        const {title} = this.props;

        return (
            <div className="gm-border gm-padding-5 gm-margin-5">
                <div className="gm-border-bottom">{title}</div>
                <div className="gm-padding-tb-5">
                    asdfa
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    title: PropTypes.string.isRequired
};

class Right extends React.Component {
    render() {
        return (
            <div>
                <Panel title="标题"></Panel>
            </div>
        );
    }
}

Right.propTypes = {
    config: PropTypes.object
};

Right.deaultProps = {};

export default Right;