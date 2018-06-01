import React from 'react';
import {observer} from 'mobx-react';
import printerStore from './store';

@observer
class Page extends React.Component {
    render() {
        const {children} = this.props;

        const {top, right, bottom, left} = printerStore.gap;
        return (
            <div className="gm-printer-page" style={{
                width: `calc(${printerStore.size.width} - ${left} - ${right})`,
                height: `calc(${printerStore.size.height} - ${top} - ${bottom})`,
                padding: `${top} ${right} ${bottom} ${left}`
            }}>
                <div className="gm-printer-page-inner">
                    {children}
                </div>
            </div>
        );
    }
}

Page.propTypes = {};

Page.defaultProps = {};

export default Page;
