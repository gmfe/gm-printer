function getHeight(el) {
    const styles = window.getComputedStyle(el);
    const height = el.offsetHeight;
    const borderTopWidth = parseFloat(styles.borderTopWidth);
    const borderBottomWidth = parseFloat(styles.borderBottomWidth);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
}

function getWidth(el) {
    const styles = window.getComputedStyle(el);
    const width = el.offsetWidth;
    const borderLeftWidth = parseFloat(styles.borderLeftWidth);
    const borderRightWidth = parseFloat(styles.borderRightWidth);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);
    return width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight;
}

export {
    getHeight,
    getWidth
};