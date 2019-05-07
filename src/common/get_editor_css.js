// eslint-disable-next-line
import editorCSS from 'css-loader!postcss-loader!less-loader!./style.lesss'

export default function getEditorCSS () {
  return editorCSS.toString()
}
