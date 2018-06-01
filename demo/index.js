import React from 'react';
import ReactDOM from 'react-dom';
import {
    Printer,
    Page,
    PageTitle,
    PageHeader,
    PageTop,
    PageTable,
    PageBottom,
    PageFooter,
    PageFixed
} from '../src/index';
import '../src/style.less';
import 'normalize.css/normalize.css';

let tableData = [{
    a: 'adfafa你们啊我们',
    b: '不是阿发发发飒飒发搜索asf',
    c: '地方啥愣是带饭了',
    d: '我们的'
}];

_.each(_.range(14), () => {
    tableData.push(Object.assign({}, tableData[0]));
});

_.each(tableData, (v, i) => v.a = i + '_' + v.a);

class App extends React.Component {
    render() {
        return (
            <div>
                <Printer
                    title={<PageTitle/>}
                    header={<PageHeader/>}
                    top={<PageTop/>}
                    table={<PageTable
                        columns={[{
                            field: 'a',
                            name: '你好'
                        }, {
                            field: 'b',
                            name: '你好',
                            style: {width: '100px'}
                        }, {
                            field: 'c',
                            name: '你好'
                        }, {
                            field: 'd',
                            name: '你好'
                        }]}
                        data={tableData}
                    />}
                    bottom={<PageBottom/>}
                    footer={<PageFooter/>}
                    fixed={<PageFixed/>}
                />
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('appContainer'));