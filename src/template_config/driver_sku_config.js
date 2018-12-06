import i18next from '../../locales'

export default {
  'name': i18next.t('配送装车清单'),
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
        'text': i18next.t('配送装车清单'),
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
      'height': '62px'
    }
  },
  'contents': [
    {
      'style': {
        'height': '60px'
      },
      'blocks': [
        {
          'style': {},
          'type': 'counter'
        }
      ]
    },
    {
      'type': 'table',
      'dataKey': 'driver_sku',
      'subtotal': {
        'show': false
      },
      'specialStyle': {
        'fontSize': '16px'
      },
      'columns': [
        {
          'head': i18next.t('商品名称'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.商品名称}}'),
          'style': {
            'textAlign': 'center'
          }
        },
        {
          'head': i18next.t('总计'),
          'headStyle': {
            'textAlign': 'center'
          },
          'text': i18next.t('{{列.总计}}'),
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
          'head': i18next.t('明细'),
          'headStyle': {
            'textAlign': 'left'
          },
          'text': i18next.t('{{列.明细}}'),
          'style': {
            'textAlign': 'left'
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
