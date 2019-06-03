import React from 'react'
import ReactDOM from 'react-dom'
import i18next from '../../../locales'
import PropTypes from 'prop-types'

class Dialog extends React.Component {
  handleCancel = () => {
    this.props.onCancel()
    Dialog.hide()
  }

  handleOK = () => {
    this.props.onOK().then(() => {
      Dialog.hide()
    }, (err) => {
      console.error(err)
    })
  }

  render () {
    const { children, title } = this.props

    return (
      <div>
        <div className='gm-modal-mask'/>
        <div className='gm-modal gm-animated gm-animated-fade-in-bottom gm-dialog gm-dialog-confirm'>
          <div className='gm-modal-dialog'>
            <button onClick={() => { Dialog.hide() }} type='button' class='close gm-modal-close'>
              <span>×</span>
            </button>
            <div className='gm-modal-title-wrap'>
              <div className='gm-modal-title'>
                {title}
              </div>
            </div>
            <div className='gm-modal-content'>
              {children}
              <div class='gm-gap-10'/>
              <div className='text-right'>
                <button onClick={this.handleCancel} className='btn btn-default'>{i18next.t('取消')}</button>
                <div class='gm-gap-10'/>
                <button onClick={this.handleOK} className='btn btn-primary'>{i18next.t('确定')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dialog.render = ({ title, children, onOK, onCancel }) => {
  ReactDOM.render(<Dialog title={title} onOK={onOK} onCancel={onCancel}>{children}</Dialog>, window.shadowRoot.getElementById('gm-printer-modal'))
}

Dialog.hide = () => {
  ReactDOM.unmountComponentAtNode(window.shadowRoot.getElementById('gm-printer-modal'))
}

Dialog.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onOK: PropTypes.func
}

Dialog.defaultProps = {
  onCancel: () => {},
  onOK: () => {}
}

export default Dialog
