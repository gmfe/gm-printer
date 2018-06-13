import _ from 'lodash';
import {printerJS} from './util';

const printerId = '_gm-printer_' + Math.random();
let $printer = window.document.getElementById(printerId);
let ready = false;
let stacks = [];

function init(isBatch) {
    if (!$printer) {
        $printer = window.document.createElement('iframe');
        $printer.id = printerId;
        $printer.style.position = 'fixed';
        $printer.style.top = '0';
        $printer.style.left = '-1200px';
        $printer.style.width = '1000px';

        window.document.body.appendChild($printer);

        const script = $printer.contentWindow.document.createElement('script');
        script.src = printerJS;
        $printer.contentWindow.document.body.append(script);

        script.addEventListener('load', () => {
            ready = true;

            _.each(stacks, v => {
                isBatch ? do_print_batch(v) : do_print(v);
            });
        });
    }
}

function do_print({data, tableData, config}) {
    $printer.contentWindow.render({
        data,
        tableData,
        config
    });
    $printer.contentWindow.print();
}

function do_print_batch({datas, tableDatas, config}) {
    $printer.contentWindow.renderBatch({
        datas,
        tableDatas,
        config
    });
    $printer.contentWindow.print();
}

function doPrint({data, tableData, config}) {
    init();

    if (!ready) {
        stacks.push({data, tableData, config});
    } else {
        do_print({data, tableData, config});
    }
}

function doPrintBatch({datas, tableDatas, config}) {
    init(true);

    if (!ready) {
        stacks.push({datas, tableDatas, config});
    } else {
        do_print_batch({datas, tableDatas, config});
    }
}

export {
    doPrint,
    doPrintBatch
};
