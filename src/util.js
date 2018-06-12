import {version} from '../package.json';

const __DEBUG__ = process.env.NODE_ENV === 'development';

const printerJS = __DEBUG__ ? '/printer.js' : `//js.guanmai.cn/build/libs/gm-printer/${version}/printer.js`; // eslint-disable-line


const fontSizeList = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
    '26px',
    '28px'
];

export {
    fontSizeList,
    printerJS
};