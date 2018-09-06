// eslint-disable-next-line
import normalizeCSS from 'css-loader!./normalize.csss'
// eslint-disable-next-line
import printerCSS from 'css-loader!postcss-loader!less-loader!./style.lesss'

function getCSS () {
  return normalizeCSS.toString() + printerCSS.toString()
}

export default getCSS
