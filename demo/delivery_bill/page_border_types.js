/**
 * 边框类型列表（外部配置，不进模板 config）
 */
export default [
  {
    id: 'demo-a4',
    name: 'Demo边框',
    imageUrl:
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="210" height="297"><rect x="4" y="4" width="202" height="289" fill="none" stroke="#c45c26" stroke-width="8"/><rect x="14" y="14" width="182" height="269" fill="none" stroke="#c45c26" stroke-width="2"/></svg>'
      ),
    pageTypes: ['A4', 'A5'],
    gap: {
      paddingTop: '12mm',
      paddingRight: '12mm',
      paddingBottom: '12mm',
      paddingLeft: '12mm'
    }
  }
]
