import React from 'react';
import PropTypes from 'prop-types';

class Page extends React.Component {
    render() {
        return (
            <div></div>
        );
    }
}

Page.propTypes = {
    size: PropTypes.oneOf(['A4'])
};

Page.deaultProps = {};

export default Page;