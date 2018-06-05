import {observable, action, configure, toJS} from 'mobx';
import _ from 'lodash';

configure({enforceActions: true});

const settingMap = {
    'A4': {
        size: {
            width: '794px', // '210mm',
            height: '1123px' // '297mm'
        },
        gap: {
            top: '5mm',
            right: '5mm',
            bottom: '5mm',
            left: '5mm'
        }
    }
};

class PrinterStore {
    // TODO
    @observable
    sizeLabel = '';

    @observable
    size = settingMap.A4.size;

    @observable
    gap = settingMap.A4.gap;

    @observable
    ready = false;

    @observable
    height = {
        title: 0,
        top: 0,
        header: 0,
        table: 0,
        bottom: 0,
        footer: 0,
        page: 0
    };

    @observable
    table = {
        data: [],
        head: {
            widths: [],
            height: 0
        },
        body: {
            heights: []
        }
    };

    @observable
    page = []; // [{begin, end}]


    @action
    setSize(size) {
        if (_.isString(size) && settingMap[size]) {
            this.size = settingMap[size].size;
        } else if (_.isObject(size)) {
            this.size = size;
        }
    }

    @action
    setGap(gap) {
        if (_.isString(gap) && settingMap[gap]) {
            this.gap = settingMap[gap].gap;
        } else if (_.isObject(gap)) {
            this.gap = gap;
        }
    }

    @action
    setHeight(height) {
        this.height = Object.assign(this.height, height);
        console.log(toJS(this.height));
    }

    @action
    setTable(table) {
        this.table = table;
        console.log(toJS(this.table));
    }

    @action
    setReady(ready) {
        this.ready = ready;
    }

    @action
    setPage() {
        if (this._onePage()) {
            return;
        }

        if (this._twoPage()) {
            return;
        }
    }

    _onePage() {
        const height = this.height.title
            + this.height.top
            + this.height.header
            + this.height.table
            + this.height.bottom
            + this.height.footer;

        if (height > this.height.page) {
            return false;
        }

        this.page = [{
            begin: 0,
            end: this.table.data.length
        }];

        console.log(JSON.stringify(toJS(this.page)));

        return true;
    }

    _twoPage() {
        const height = this.height.title
            + this.height.top
            + this.height.header
            + this.height.table + this.table.head.height
            + this.height.bottom
            + this.height.footer;

        if (height > (this.height.page * 2)) {
            return false;
        }

        let cHeight = this.height.title
            + this.height.header
            + this.height.top
            + this.table.head.height + this.table.body.heights[0]
            + this.height.footer;
        let end = 1;

        while (cHeight < this.height.page) {
            cHeight += this.table.body.heights[end];
            end++;
            console.log(end, cHeight);
        }

        this.page = [{
            begin: 0,
            end: end - 1
        }, {
            begin: end - 1,
            end: this.table.data.length
        }];

        console.log(JSON.stringify(toJS(this.page)));
        return true;
    }
}

const printerStore = new PrinterStore();

export default printerStore;