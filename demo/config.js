const config = {
    "page": {
        "type": "A4",
        "size": {"width": "210mm", "height": "297mm"},
        "gap": {"paddingTop": "5mm", "paddingRight": "5mm", "paddingBottom": "5mm", "paddingLeft": "5mm"}
    },
    "title": {
        "text": "GDAILY FRESH SDN.BHD.",
        "style": {
            "fontSize": "28px",
            "fontWeight": "bold",
            "textAlign": "center",
            "paddingTop": "0px",
            "paddingBottom": "0px",
            "height": "0px"
        }
    },
    "header": {
        "blocks": [{
            "text": "(1219631-A)",
            "style": {"position": "absolute", "left": "", "top": "10px", "right": "110px", "bottom": ""}
        }, {
            "text": "LOT 17504,KAWASAN PERINDUSTRIAN SELAYANG,68100 BATU CAVES,SELANGOR.",
            "style": {"position": "absolute", "left": "100px", "top": "40px", "bottom": "", "right": ""}
        }, {
            "text": "Phone: 03-6127 9887  Fax:03-6128 3387",
            "style": {"position": "absolute", "left": "240px", "top": "60px", "bottom": "", "right": ""}
        }, {
            "text": "Email: accounts@gdailyfresh.com",
            "style": {"position": "absolute", "left": "260px", "top": "80px", "bottom": "", "right": ""}
        }, {
            "text": "------------------------------------------------------------------------------",
            "style": {"position": "absolute", "left": "0px", "top": "95px", "bottom": ""}
        }, {
            "text": "-----------------------------------------------------------------------------",
            "style": {"position": "absolute", "left": "2px", "top": "95px", "bottom": "", "right": ""}
        }, {
            "text": "Bill to:",
            "style": {
                "position": "absolute",
                "left": "10px",
                "top": "110px",
                "fontWeight": "bold",
                "bottom": "",
                "right": ""
            }
        }, {
            "text": "Delivery Address",
            "style": {"position": "absolute", "left": "40%", "top": "110px", "bottom": "", "right": ""}
        }, {
            "text": "INVOICE",
            "style": {
                "position": "absolute",
                "left": "",
                "top": "110px",
                "bottom": "",
                "right": "50px",
                "fontWeight": "bold",
                "fontSize": "24px"
            }
        }, {"text": "RU DI FOOK", "style": {"position": "absolute", "left": "0px", "top": "0px"}}],
        "style": {"height": "300px"}
    },
    "top": {
        "blocks": [{
            "text": "收货商户: ${data.resname}(${data.sid})",
            "style": {"position": "absolute", "left": "0px", "top": "0px"}
        }], "style": {"height": "30px"}
    },
    "table": {
        "columns": [{
            "head": "ID",
            "headStyle": {"textAlign": "center"},
            "text": "${tableData.id}",
            "style": {"textAlign": "left"}
        }, {
            "head": "商品名",
            "headStyle": {"textAlign": "center"},
            "text": "${tableData.name}",
            "style": {"textAlign": "center"}
        }, {
            "head": "品类",
            "headStyle": {"textAlign": "center"},
            "text": "${tableData.pinlei_title}",
            "style": {"textAlign": "center"}
        }, {
            "head": "SPU",
            "headStyle": {"textAlign": "center"},
            "text": "${tableData.spu_name}",
            "style": {"textAlign": "center"}
        }, {
            "head": "销售价格",
            "headStyle": {"textAlign": "center"},
            "text": "${tableData.sale_price} ¥",
            "style": {"textAlign": "right"}
        }]
    },
    "bottom": {
        "blocks": [{
            "text": "应付: ${data.real_price} ¥",
            "style": {"position": "absolute", "left": "0px", "top": "0px"}
        }, {"text": "出库签字：", "style": {"position": "absolute", "left": "0px", "top": "20px"}}, {
            "text": "配送签字：",
            "style": {"position": "absolute", "left": "40%", "top": "20px"}
        }, {"text": "客户签字：", "style": {"position": "absolute", "left": "70%", "top": "20px"}}],
        "style": {"height": "50px"}
    },
    "footer": {
        "blocks": [{
            "text": "页 ${pagination.pageIndex}/${pagination.count}",
            "style": {"position": "absolute", "top": "0px", "right": "0px"}
        }], "style": {"height": "20px"}
    },
    "fixed": {
        "blocks": [{
            "type": "image",
            "link": "http://js.guanmai.cn/static_storage/json/common/logo/default/logo.pure.png",
            "style": {"position": "absolute", "left": "0px", "top": "0px", "height": "30px"}
        }]
    }
};

export default config;