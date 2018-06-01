import {observable, action, configure, toJS, computed} from 'mobx';
import _ from 'lodash';

configure({enforceActions: true});

const sizeMap = {
    'A4': {
        width: '794px', // '210mm',
        height: '1123px' // '297mm'
    }
};

class PrinterStore {
    // TODO
    @observable
    sizeLabel = '';

    @observable
    size = sizeMap.A4;

    @observable
    gap = {
        top: '5mm',
        right: '5mm',
        bottom: '5mm',
        left: '5mm'
    };

    @observable
    ready = {
        title: false,
        top: false,
        header: false,
        table: false,
        bottom: false,
        footer: false
    };

    @observable
    height = {
        title: 0,
        top: 0,
        header: 0,
        table: 0,
        bottom: 0,
        footer: 0
    };

    @observable
    table = {};

    @observable
    pageCount = 1;

    @action
    setSize(size) {
        if (_.isString(size) && sizeMap[size]) {
            this.size = sizeMap[size];
        } else if (_.isObject(size)) {
            this.size = size;
        }
    }

    @action
    setGap(gap) {
        this.gap = gap;
    }

    @action
    setReady(ready, height) {
        this.ready = Object.assign(this.ready, ready);
        this.height = Object.assign(this.height, height);
        console.log(toJS(this.ready), toJS(this.height));
    }

    @computed
    get computedHeight() {
        return this.height.title + this.height.top + this.height.header + this.height.table + this.height.bottom + this.height.footer;
    }
}

const printerStore = new PrinterStore();

export default printerStore;