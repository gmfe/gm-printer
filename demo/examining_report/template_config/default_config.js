import i18next from '../../../locales'

export default {
  name: '',
  defaultTableDataKey: 'examiningDetail',
  page: {
    name: 'A4',
    size: {
      width: '210mm',
      height: '297mm'
    },
    printDirection: 'vertical',
    type: 'A4',
    gap: {
      paddingRight: '5mm',
      paddingLeft: '5mm',
      paddingBottom: '5mm',
      paddingTop: '5mm'
    }
  },
  header: {
    style: { height: '90px' },
    blocks: [
      {
        text: i18next.t('溯源检测报告'),
        style: {
          right: '0px',
          left: '0px',
          position: 'absolute',
          top: '10px',
          fontWeight: 'bold',
          fontSize: '26px',
          textAlign: 'center'
        }
      },
      {
        text: i18next.t('报告编号：{{报告编号}}'),
        style: {
          left: '2px',
          position: 'absolute',
          top: '55px'
        }
      },
      {
        text: i18next.t('检测日期：{{检测日期}}'),
        style: {
          left: '280px',
          position: 'absolute',
          top: '55px'
        }
      },
      {
        text: i18next.t('检测机构：{{检测机构}}'),
        style: {
          left: '460px',
          position: 'absolute',
          top: '55px'
        }
      }
    ]
  },
  contents: [
    {
      className: '',
      type: 'table',
      dataKey: 'examiningDetail',
      subtotal: { show: false },
      specialConfig: { style: {} },
      columns: [
        {
          head: i18next.t('序号'),
          text: i18next.t('{{列.序号}}'),
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: i18next.t('样品名称'),
          text: i18next.t('{{列.样品名称}}'),
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: i18next.t('样品编码'),
          text: i18next.t('{{列.样品编码}}'),
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        },
        {
          head: i18next.t('检测结果'),
          text: i18next.t('{{列.检测结果}}'),
          style: { textAlign: 'center' },
          headStyle: { textAlign: 'center' }
        }
      ]
    }
  ],
  sign: {
    blocks: [],
    style: { height: '0px' }
  },
  footer: {
    blocks: [
      {
        text: i18next.t('打印时间：{{打印时间}}'),
        style: {
          left: '2px',
          position: 'absolute',
          top: '5px'
        }
      }
    ],
    style: { height: '30px' }
  }
}
