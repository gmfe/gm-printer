const config = {
    title: {
        text: '四川九州昌隆农业有限公司',
        style: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '10px 0',
            height: '30'
        }
    },
    header: {
        blocks: [{
            text: '配送时间: ${data.receive_begin_time_t1} ~ ${data.receive_end_time_t1}',
            style: {
                position: 'absolute',
                left: 0,
                top: 0
            }
        }, {
            text: '序号: ${data.sort_id}',
            style: {
                position: 'absolute',
                left: 350,
                top: 0
            }
        }, {
            text: '客服电话: ${data.receiver_phone}',
            style: {
                position: 'absolute',
                left: 500,
                top: 0
            }
        }],
        style: {
            height: 30
        }
    },
    top: {
        blocks: [{
            text: '收货商户: ${data.resname}(${data.sid})',
            style: {
                position: 'absolute',
                left: 0,
                top: 0
            }
        }],
        style: {
            height: 30
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
            text: '${tableData.name}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: '品类',
            text: '${tableData.pinlei_title}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: 'SPU',
            text: '${tableData.spu_name}',
            style: {
                textAlign: 'center'
            }
        }, {
            head: '销售价格',
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
                left: 0,
                top: 0
            }
        }, {
            text: '出库签字：',
            style: {
                position: 'absolute',
                left: 0,
                top: 20
            }
        }, {
            text: '配送签字：',
            style: {
                position: 'absolute',
                left: '40%',
                top: 20
            }
        }, {
            text: '客户签字：',
            style: {
                position: 'absolute',
                left: '70%',
                top: 20
            }
        }],
        style: {
            height: 50
        }
    },
    footer: {
        blocks: [{
            text: '页 ${pagination.pageIndex}/${pagination.count}',
            style: {
                position: 'absolute',
                top: 0,
                right: 0
            }
        }],
        style: {
            height: 20
        }
    },
    fixed: {
        blocks: [{
            type: 'logo',
            link: 'http://js.guanmai.cn/static_storage/json/common/logo/default/logo.pure.png',
            style: {
                position: 'absolute',
                left: 0,
                top: 0,
                height: 30
            }
        }]
    }
};

export default config;