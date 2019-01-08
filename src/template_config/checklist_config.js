import i18next from '../../locales'

export default {
  'name': i18next.t('分拣核查单'),
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
        'text': i18next.t('分拣核查单'),
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
        'text': i18next.t('分拣序号：{{分拣序号}}'),
        'style': {
          'left': '261px',
          'position': 'absolute',
          'top': '50px'
        }
      },
      {
        'text': i18next.t('司机：{{司机}}'),
        'style': {
          'right': '',
          'left': '553px',
          'position': 'absolute',
          'top': '50px'
        }
      },
      {
        'text': i18next.t('商户名：{{商户名}}'),
        'style': {
          'left': '2px',
          'position': 'absolute',
          'top': '76px'
        }
      },
      {
        'text': i18next.t('线路：{{线路}}'),
        'style': {
          'left': '261px',
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
      'type': 'table',
      'dataKey': 'check_list',
      'subtotal': {
        'show': false
      },
      'columns': [
        {
          'head': i18next.t('序号'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.序号}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('分类'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.分类}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('商户ID'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.商户ID}}'),
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
          'head': i18next.t('规格'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.规格}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('下单数(基本单位)'),
          'headStyle': {
            'textAlign': 'center'
          },
          'style': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.下单数_基本单位}}{{列.基本单位}}')
        },
        {
          'head': i18next.t('实配数(基本单位)'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.实配数_基本单位}}{{列.基本单位}}')
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
