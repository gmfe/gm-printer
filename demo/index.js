import React from 'react';
import ReactDOM from 'react-dom';
import {
    Page,
    PageHeader,
    PageTop,
    PageContent,
    PageBottom,
    PageFooter,
    PageFixed
} from '../src/index';
import '../src/style.less';

class App extends React.Component {
    render() {
        return (
            <div>
                <Page size="A4">
                    <PageHeader></PageHeader>
                    <PageTop></PageTop>
                    <PageContent></PageContent>
                    <PageBottom></PageBottom>
                    <PageFooter></PageFooter>
                    <PageFixed></PageFixed>
                </Page>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('appContainer'));