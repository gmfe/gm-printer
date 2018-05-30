import {observable, action, configure, toJS} from 'mobx';
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
        top: false,
        header: false,
        content: false,
        bottom: false,
        footer: false
    };

    @observable
    height = {
        top: 0,
        header: 0,
        bottom: 0,
        footer: 0
    };

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
}

const printerStore = new PrinterStore();

export default printerStore;