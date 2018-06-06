const config = {
    title: {
        text: '四川九州昌隆农业有限公司',
        style: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '10px 0'
        }
    },
    header: {
        blocks: [{
            text: '配送时间: ${data.receive_begin_time_t1}~${data.receive_end_time_t1}',
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
            height: 50
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
            height: 20
        }
    },
    table: {
        columns: [{
            field: 'id',
            text: 'Id'
        }, {
            field: 'name',
            text: '商品名'
        }, {
            field: 'pinlei_title',
            text: '品类'
        }, {
            field: 'spu_name',
            text: 'SPU'
        }]
    }
};

export default config;