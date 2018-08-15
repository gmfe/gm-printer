import { observable, action, configure } from 'mobx'
import { panelList } from '../config'

configure({enforceActions: true})

class EditStore {
  @observable
  name = ''

  @observable
  data = {
    config: {
      text: '',
      style: {}
    }
  }

  @observable
  insertPanel = panelList[0].value

  @observable
  setName (name) {
    this.name = name
  }

  @action
  setConfig (config) {
    this.data.config = config
  }

  @action
  setConfigAndBroadcast (config) {
    this.setConfig(config)

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-config-broadcast', {
      detail: {
        name: this.name,
        config
      }
    }))
  }

  @action
  setInsertPanel (panel) {
    this.insertPanel = panel
  }
}

const editStore = new EditStore()

export default editStore
