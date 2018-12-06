import i18next from '../../locales'

export default {
  'name': i18next.t('配送任务清单'),
  'page': {
    'type': 'A4',
    'name': 'A4',
    'printDirection': 'vertical',
    'size': {
      'width': '210mm',
      'height': '297mm'
    },
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
        'text': i18next.t('配送任务清单'),
        'style': {
          'position': 'absolute',
          'left': '0px',
          'top': '0px',
          'right': '0px',
          'textAlign': 'center',
          'fontSize': '26px',
          'fontWeight': 'bold'
        }
      },
      {
        'text': i18next.t('配送司机: {{配送司机}}'),
        'style': {
          'position': 'absolute',
          'left': '4px',
          'top': '39px'
        }
      },
      {
        'text': i18next.t('车牌号：{{车牌号}}'),
        'style': {
          'position': 'absolute',
          'left': '154px',
          'top': '39px'
        }
      },
      {
        'text': i18next.t('打印时间：{{打印时间}}'),
        'style': {
          'position': 'absolute',
          'left': '',
          'top': '39px',
          'right': '11px'
        }
      },
      {
        'text': i18next.t('联系方式：{{联系方式}}'),
        'style': {
          'position': 'absolute',
          'left': '',
          'top': '39px',
          'right': '297px'
        }
      }
    ],
    'style': {
      'height': '57px'
    }
  },
  'contents': [
    {
      'type': 'table',
      'dataKey': 'driver_task',
      'subtotal': {
        'show': false
      },
      'columns': [
        {
          'head': i18next.t('序号'),
          'headStyle': {
            'width': '2em',
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.序号}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('订单号'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.订单号}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('商户名'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.商户名}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('收货地址'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.收货地址}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('收货时间'),
          'headStyle': {
            'width': '92px',
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.收货时间}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('配送框数'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.配送框数}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('回收框数'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.回收框数}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('订单备注'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.订单备注}}'),
          'style': {
            'textAlign': 'center'
          }
        }
      ],
      'className': ''
    }
  ],
  'sign': {
    'blocks': [],
    'style': {
      'height': '0'
    }
  },
  'footer': {
    'blocks': [
      {
        'text': i18next.t('页码： {{当前页码}} / {{页码总数}}'),
        'style': {
          'position': 'absolute',
          'left': '',
          'top': '-0.15625px',
          'right': '0px'
        }
      }
    ],
    'style': {
      'height': '15px'
    }
  }
}
