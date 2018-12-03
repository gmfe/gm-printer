let config = {
  resourceDir: 'resource',
  outputDir: 'out',
  // 下面是双语替换排除的路径
  exclude: ['demo/*.js', './data_to_key/index.js', './data_to_key/util.js'],
  callStatement: 'i18next.t',
  importStatementStr: 'import {i18next} from \'gm-i18n\';\n'
}

module.exports = config
