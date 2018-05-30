import React from 'react';
import {observer} from 'mobx-react';
import printerStore from './store';

@observer
class Page extends React.Component {
    constructor(props) {
        super(props);
        printerStore.setSize(props.size);
    }

    render() {
        const {children} = this.props;

        return (
            <div className="gm-printer" style={{
                width: printerStore.size.width,
                height: printerStore.size.height
            }}>
                {children}
            </div>
        );
    }
}

Page.propTypes = {};

Page.deaultProps = {};

export default Page;
