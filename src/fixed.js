import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {observer} from "mobx-react/index";

@observer
class Fixed extends React.Component {
    render() {

        const {blocks} = this.props;

        return (
            <div className="gm-printer-fixed">
                {_.map(blocks, (v, i) => {
                    if (v.type === 'image') {
                        return (
                            <img key={i} src={v.link} style={v.style} alt=""/>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }
}

Fixed.propTypes = {
    blocks: PropTypes.array.isRequired
};

export default Fixed;