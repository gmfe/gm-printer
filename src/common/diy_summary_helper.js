import { set, toJS } from 'mobx'
import _ from 'lodash'

/**
 * 创建自定义合计功能的通用方法体（不包含装饰器）
 * @param {string} configKey - 配置键名，如 'diyOverallOrder', 'diySubtotal', 'diyTagSubtotal'
 * @param {string} defaultName - 默认名称，如 '自定义整单合计', '自定义每页合计'
 * @returns {Object} 包含所有方法体的对象
 */
export function createDiySummaryStoreMethods(configKey, defaultName) {
  // 将 configKey 转换为方法名格式，如 'diyOverallOrder' -> 'DiyOverallOrder'
  const methodName = configKey
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return {
    // 显示/隐藏
    [`set${methodName}Show`]: function(name, show) {
      const arr = name.split('.')
      const table = this.config.contents[arr[2]]

      this.overallOrderShow = !this.overallOrderShow
      if (table[configKey]) {
        set(table[configKey], {
          show: show ?? !table[configKey].show
        })
      } else {
        set(table, {
          [configKey]: {
            show: true,
            fields: [
              {
                name: `${defaultName}：`,
                valueField: '{{列.出库金额}}',
                style: { fontWeight: 'bold' },
                rightName: `${defaultName}：`
              }
            ]
          }
        })
      }
      this.config = toJS(this.config)
    },

    // 样式设置
    [`set${methodName}Style`]: function(value) {
      if (this.selectedRegion) {
        const flexStyle = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end'
        }
        const arr = this.selectedRegion.split('.')
        const configFields = this.config.contents[arr[2]]?.[configKey].fields
        _.forEach(configFields, item => {
          const oldStyle = item.style || {}
          set(item, {
            style: {
              ...oldStyle,
              ...value,
              'justify-content': flexStyle[value.textAlign]
            }
          })
        })
      }
    },

    // 设置大写金额
    [`set${methodName}UpperCase`]: function() {
      if (this.selectedRegion) {
        this.overallOrderShow = !this.overallOrderShow
        const arr = this.selectedRegion.split('.')
        const config = this.config.contents[arr[2]]?.[configKey]

        const oldNeedUpperCase = config?.needUpperCase
        this.config.contents[arr[2]]?.[configKey] &&
          set(config, { needUpperCase: !oldNeedUpperCase })
        if (
          this.config.contents[arr[2]]?.[configKey] &&
          config.needUpperCase === false
        ) {
          config.isUpperCaseBefore && set(config, { isUpperCaseBefore: false })
          config.isUpperLowerCaseSeparate &&
            set(config, { isUpperLowerCaseSeparate: false })
        }
      }
    },

    // 设置大写金额在前
    [`set${methodName}UpperCaseBefore`]: function() {
      if (this.selectedRegion) {
        this.overallOrderShow = !this.overallOrderShow
        const arr = this.selectedRegion.split('.')
        const config = this.config.contents[arr[2]]?.[configKey]

        const oldUpperCaseBefore = config?.isUpperCaseBefore
        this.config.contents[arr[2]]?.[configKey] &&
          set(config, { isUpperCaseBefore: !oldUpperCaseBefore })
      }
    },

    // 设置大小写金额分开
    [`set${methodName}UpperLowerCaseSeparate`]: function() {
      if (this.selectedRegion) {
        this.overallOrderShow = !this.overallOrderShow
        const arr = this.selectedRegion.split('.')
        const config = this.config.contents[arr[2]]?.[configKey]

        const oldUpperLowerCaseSeparate = config.isUpperLowerCaseSeparate
        set(config, {
          isUpperLowerCaseSeparate: !oldUpperLowerCaseSeparate
        })
      }
    },

    // 字段设置
    [`set${methodName}ValueField`]: function(value) {
      if (this.selectedRegion) {
        this.overallOrderShow = !this.overallOrderShow
        const arr = this.selectedRegion.split('.')
        const config = this.config.contents[arr[2]]?.[configKey]

        const oldValueField = config.fields?.[0]
        set(oldValueField, {
          valueField: value
        })
      }
    },

    // 文案设置
    [`set${methodName}Fields`]: function(value, isModifyRightText) {
      if (this.selectedRegion) {
        this.overallOrderShow = !this.overallOrderShow
        const arr = this.selectedRegion.split('.')
        const table = this.config.contents[arr[2]]
        const config = table?.[configKey]

        if (!config.fields) {
          config.fields = []
        }
        if (!config.fields[0]) {
          config.fields = [
            {
              name: `${defaultName}：`,
              valueField: '{{列.出库金额}}',
              style: { fontWeight: 'bold' },
              rightName: `${defaultName}：`
            }
          ]
        }

        const targetField = config.fields[0]
        if (!isModifyRightText) {
          set(targetField, { name: value })
        } else {
          set(targetField, { rightName: value })
        }
      }
    }
  }
}

/**
 * 创建自定义合计功能的 UI 渲染函数（Editor 层）
 * @param {Object} params - 配置参数
 * @param {string} params.configKey - 配置键名
 * @param {string} params.label - 显示标签
 * @param {string} params.placeholder - 输入框占位符
 * @param {string} params.showConfigKey - config 中控制显示的键名，如 'showDiyOverAllOrder'
 * @returns {Function} 返回渲染函数
 */
export function createDiySummaryEditorRender({
  configKey,
  label,
  placeholder,
  showConfigKey
}) {
  return function(editStore, handleStyleChange) {
    const diyConfig = editStore.computedTableSpecialConfig?.[configKey]
    const style = (diyConfig && diyConfig?.fields?.[0]?.style) || {}
    const needUpperCase =
      (editStore.computedTableSpecialConfig?.[configKey] &&
        diyConfig?.needUpperCase) ||
      false
    const caseBefore =
      (editStore.computedTableSpecialConfig?.[configKey] &&
        diyConfig?.isUpperCaseBefore) ||
      false
    const upperLowerCaseSeparate = diyConfig?.isUpperLowerCaseSeparate || false
    const valueField =
      editStore.computedTableSpecialConfig?.[configKey]?.fields?.[0]?.valueField

    const methodName = configKey
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    const setStyleMethod = editStore[`set${methodName}Style`]
    const setUpperCaseMethod = editStore[`set${methodName}UpperCase`]
    const setUpperCaseBeforeMethod =
      editStore[`set${methodName}UpperCaseBefore`]
    const setUpperLowerCaseSeparateMethod =
      editStore[`set${methodName}UpperLowerCaseSeparate`]
    const setValueFieldMethod = editStore[`set${methodName}ValueField`]
    const setFieldsMethod = editStore[`set${methodName}Fields`]

    return {
      diyConfig,
      style,
      needUpperCase,
      caseBefore,
      upperLowerCaseSeparate,
      valueField,
      setStyleMethod,
      setUpperCaseMethod,
      setUpperCaseBeforeMethod,
      setUpperLowerCaseSeparateMethod,
      setValueFieldMethod,
      setFieldsMethod
    }
  }
}
