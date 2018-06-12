import {version} from '../package.json';

const __DEBUG__ = process.env.NODE_ENV === 'development';

const printerJS = __DEBUG__ ? '/printer.js' : `//js.guanmai.cn/build/libs/gm-printer/${version}/printer.js`; // eslint-disable-line

export {
    printerJS
};