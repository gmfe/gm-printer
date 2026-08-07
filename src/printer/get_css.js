// eslint-disable-next-line
import normalizeCSS from 'css-loader!./normalize.csss'
// eslint-disable-next-line
import printerCSS from 'css-loader!postcss-loader!less-loader!./style.lesss'

function getCSS() {
  const detailsCSS =
    '.b-table-details{border-bottom:1px dashed #ddd;padding-bottom:3px;margin-bottom:3px;}' +
    '.b-table-details:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0;}'
  return normalizeCSS.toString() + printerCSS.toString() + detailsCSS
}

export default getCSS
