const printerJS = `//js.guanmai.cn/build/libs/gm-printer_malai/0.0.0/build/printer.js`; // eslint-disable-line

const fontSizeList = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px"
];

const borderStyleList = [
  { value: "solid", text: "实线" },
  { value: "dashed", text: "虚线" },
  { value: "dotted", text: "圆点" }
];

const tableStyleList = [
  { value: "gm-printer-table-style-1", text: "样式一" },
  { value: "gm-printer-table-style-2", text: "样式二" },
  { value: "gm-printer-table-style-3", text: "样式三" }
];

export { fontSizeList, borderStyleList, tableStyleList, printerJS };
