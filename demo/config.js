const config = {
    page: {
        type: 'A4',
        size: 'A4',
        gap: 'A4'
    },
    title: {
        text: '四川九州昌隆农业有限公司',
        style: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: '10px',
            paddingBottom: '10px',
            height: '30px'
        }
    },
    header: {
        blocks: [{
            text: '配送时间: ${data.receive_begin_time_t1} ~ ${data.receive_end_time_t1}',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px'
            }
        }, {
            text: '序号: ${data.sort_id}',
            style: {
                position: 'absolute',
                left: '350px',
                top: '0px'
            }
        }, {
            text: '客服电话: ${data.receiver_phone}',
            style: {
                position: 'absolute',
                left: '500px',
                top: '0px'
            }
        }],
        style: {
            height: '30px'
        }
    },
    top: {
        blocks: [{
            text: '收货商户: ${data.resname}(${data.sid})',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px'
            }
        }],
        style: {
            height: '30px'
        }
    },
    table: {
        columns: [{
            head: 'ID',
            headStyle: {
                textAlign: 'center'
            },
            text: '${tableData.id}',
            style: {
                textAlign: 'left'
            }
        }, {
            head: '商品名',
            headStyle: {
                textAlign: 'center'
            },
            text: '${tableData.name}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: '品类',
            headStyle: {
                textAlign: 'center'
            },
            text: '${tableData.pinlei_title}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: 'SPU',
            headStyle: {
                textAlign: 'center'
            },
            text: '${tableData.spu_name}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: '销售价格',
            headStyle: {
                textAlign: 'center'
            },
            text: '${tableData.sale_price} ¥',
            style: {
                textAlign: 'right'
            }
        }]
    },
    bottom: {
        blocks: [{
            text: '应付: ${data.real_price} ¥',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px'
            }
        }, {
            text: '出库签字：',
            style: {
                position: 'absolute',
                left: '0px',
                top: '20px'
            }
        }, {
            text: '配送签字：',
            style: {
                position: 'absolute',
                left: '40%',
                top: '20px'
            }
        }, {
            text: '客户签字：',
            style: {
                position: 'absolute',
                left: '70%',
                top: '20px'
            }
        }],
        style: {
            height: '50px'
        }
    },
    footer: {
        blocks: [{
            text: '页 ${pagination.pageIndex}/${pagination.count}',
            style: {
                position: 'absolute',
                top: '0px',
                right: '0px'
            }
        }],
        style: {
            height: '20px'
        }
    },
    fixed: {
        blocks: [{
            type: 'logo',
            link: 'http://js.guanmai.cn/static_storage/json/common/logo/default/logo.pure.png',
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px',
                height: '30px'
            }
        }]
    }
};

export default config;