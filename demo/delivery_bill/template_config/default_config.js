import i18next from '../../../locales'

export default {
  'name': '',
  'page': {
    'name': 'A4',
    'size': {
      'width': '210mm',
      'height': '297mm'
    },
    'printDirection': 'vertical',
    'type': 'A4',
    'gap': {
      'paddingRight': '5mm',
      'paddingLeft': '5mm',
      'paddingBottom': '5mm',
      'paddingTop': '5mm'
    }
  },
  'header': {
    'blocks': [
      {
        'text': i18next.t('配送单'),
        'style': {
          'right': '0px',
          'left': '0px',
          'position': 'absolute',
          'top': '0px',
          'fontWeight': 'bold',
          'fontSize': '26px',
          'textAlign': 'center'
        }
      },
      {
        'text': i18next.t('订单号: {{订单号}}'),
        'style': {
          'left': '2px',
          'position': 'absolute',
          'top': '50px'
        }
      },
      {
        'text': i18next.t('配送时间：{{配送时间}}'),
        'style': {
          'left': '261px',
          'position': 'absolute',
          'top': '76px'
        }
      },
      {
        'text': i18next.t('打印时间：{{当前时间}}'),
        'style': {
          'right': '',
          'left': '553px',
          'position': 'absolute',
          'top': '76px'
        }
      },
      {
        'text': i18next.t('分拣序号：{{分拣序号}}'),
        'style': {
          'right': '',
          'left': '450px',
          'position': 'absolute',
          'top': '50px'
        }
      },
      {
        'text': i18next.t('下单时间：{{下单时间}}'),
        'style': {
          'left': '2px',
          'position': 'absolute',
          'top': '76px'
        }
      }
    ],
    'style': {
      'height': '97px'
    }
  },
  'contents': [
    {
      'blocks': [
        {
          'text': i18next.t('收货商户: {{收货商户}}({{商户ID}})'),
          'style': {
            'left': '2px',
            'position': 'absolute',
            'top': '5px'
          }
        },
        {
          'text': i18next.t('收货人: {{收货人}}'),
          'style': {
            'right': '',
            'left': '450px',
            'position': 'absolute',
            'top': '6px'
          }
        },
        {
          'text': i18next.t('收货人电话: {{收货人电话}}'),
          'style': {
            'left': '2px',
            'position': 'absolute',
            'top': '30px'
          }
        },
        {
          'text': i18next.t('收货地址: {{收货地址}}'),
          'style': {
            'right': '',
            'left': '450px',
            'position': 'absolute',
            'top': '30px'
          }
        },
        {
          'text': i18next.t('订单备注: {{订单备注}}'),
          'style': {
            'left': '2px',
            'position': 'absolute',
            'top': '55px'
          }
        }
      ],
      'style': {
        'height': '78px'
      }
    },
    {
      'blocks': [
        {
          'type': 'counter',
          'style': {}
        }
      ],
      'style': {
        'height': '55px'
      }
    },
    {
      'className': '',
      'type': 'table',
      'dataKey': 'orders_category',
      'subtotal': {
        'show': false
      },
      'columns': [
        {
          'head': i18next.t('序号'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.序号}}')
        },
        {
          'head': i18next.t('类别'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.类别}}')
        },
        {
          'head': i18next.t('商品名'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.商品名}}')
        },
        {
          'head': i18next.t('规格'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.规格}}')
        },
        {
          'head': i18next.t('下单数'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.下单数}}{{列.销售单位}}')
        },
        {
          'head': i18next.t('出库数(基本单位)'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.出库数_基本单位}}{{列.基本单位}}')
        },
        {
          'head': i18next.t('单价(基本单位)'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.单价_基本单位}}')
        },
        {
          'head': i18next.t('出库金额'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.出库金额}}')
        }
      ]
    },
    {
      'blocks': [],
      'style': {
        'height': '15px'
      }
    },
    {
      'className': '',
      'type': 'table',
      'dataKey': 'abnormal',
      'subtotal': {
        'show': false
      },
      'columns': [
        {
          'head': i18next.t('商品名'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.商品名}}')
        },
        {
          'head': i18next.t('异常原因'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.异常原因}}')
        },
        {
          'head': i18next.t('异常数量'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.异常数量}}')
        },
        {
          'head': i18next.t('异常金额'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.异常金额}}')
        }
      ]
    },
    {
      'blocks': [
        {
          'text': i18next.t('下单金额：￥{{下单金额}}'),
          'style': {
            'left': '1px',
            'position': 'absolute',
            'top': '10px'
          }
        },
        {
          'text': i18next.t('出库金额：￥{{出库金额}}'),
          'style': {
            'left': '162px',
            'position': 'absolute',
            'top': '10px'
          }
        },
        {
          'text': i18next.t('运费：￥{{运费}}'),
          'style': {
            'left': '309px',
            'position': 'absolute',
            'top': '10px'
          }
        },
        {
          'text': i18next.t('异常金额：￥{{异常金额}}'),
          'style': {
            'left': '424px',
            'position': 'absolute',
            'top': '10px'
          }
        },
        {
          'text': i18next.t('销售额(含运税)：￥{{销售额_含运税}}'),
          'style': {
            'left': '570px',
            'position': 'absolute',
            'top': '10px'
          }
        }
      ],
      'style': {
        'height': '69px'
      }
    }
  ],
  'sign': {
    'blocks': [
      {
        'text': i18next.t('签收人：'),
        'style': {
          'left': '600px',
          'position': 'absolute',
          'top': '5px'
        }
      }
    ],
    'style': {
      'height': '46px'
    }
  },
  'footer': {
    'blocks': [
      {
        'text': i18next.t('页码： {{当前页码}} / {{页码总数}}'),
        'style': {
          'right': '',
          'left': '48%',
          'position': 'absolute',
          'top': '0px'
        }
      }
    ],
    'style': {
      'height': '15px'
    }
  }
}
