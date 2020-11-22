/**
 * 整理元素的CSS规则
 * @param {*} element 
 */
function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }
    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

/**
 * 初始化flex容器属性（即定义display:flex的元素中的其它flex属性的默认值）
 * @param {*} style
 */
function initFlex(style) {
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }
    style.isAutoMainSize = false;
}

/**
 * 根据就style初始化位置信息
 * @param {} style 
 */
function initFlexPosi(style) {
    if (style.flexDirection === 'row') {
        if (style.flexWrap === 'wrap-reverse') {
            return {
                mainSize: 'width',
                mainStart: 'left',
                mainEnd: 'right',
                mainSign: +1,
                mainBase: 0,
                crossSize: 'height',
                crossStart: 'bottom',
                crossEnd: 'top',
                crossSign: -1,
                crossBase: ''
            };
        } else {
            return {
                mainSize: 'width',
                mainStart: 'left',
                mainEnd: 'right',
                mainSign: +1,
                mainBase: 0,
                crossSize: 'height',
                crossStart: 'top',
                crossEnd: 'bottom',
                crossSign: 1,
                crossBase: 0
            };
        }
    }
    if (style.flexDirection === 'row-reverse') {
        if (style.flexWrap === 'wrap-reverse') {
            return {
                mainSize: 'width',
                mainStart: 'right',
                mainEnd: 'left',
                mainSign: -1,
                mainBase: style.width,
                crossSize: 'height',
                crossStart: 'bottom',
                crossEnd: 'top',
                crossSign: -1,
                crossBase: ''
            };
        } else {
            return {
                mainSize: 'width',
                mainStart: 'right',
                mainEnd: 'left',
                mainSign: -1,
                mainBase: style.width,
                crossSize: 'height',
                crossStart: 'top',
                crossEnd: 'bottom',
                crossSign: 1,
                crossBase: 0
            };
        }
    }
    if (style.flexDirection === 'column') {
        if (style.flexWrap === 'wrap-reverse') {
            return {
                mainSize: 'height',
                mainStart: 'top',
                mainEnd: 'bottom',
                mainSign: +1,
                mainBase: 0,
                crossSize: 'width',
                crossStart: 'right',
                crossEnd: 'left',
                crossSign: -1,
                crossBase: ''
            };
        } else {
            return {
                mainSize: 'height',
                mainStart: 'top',
                mainEnd: 'bottom',
                mainSign: +1,
                mainBase: 0,
                crossSize: 'width',
                crossStart: 'left',
                crossEnd: 'right',
                crossSign: 1,
                crossBase: 0
            };
        }
    }
    if (style.flexDirection === 'column-reverse') {
        if (style.flexWrap === 'wrap-reverse') {
            return {
                mainSize: 'height',
                mainStart: 'bottom',
                mainEnd: 'top',
                mainSign: -1,
                mainBase: style.height,
                crossSize: 'width',
                crossStart: 'right',
                crossEnd: 'left',
                crossSign: -1,
                crossBase: ''
            };
        } else {
            return {
                mainSize: 'height',
                mainStart: 'bottom',
                mainEnd: 'top',
                mainSign: -1,
                mainBase: style.height,
                crossSize: 'width',
                crossStart: 'left',
                crossEnd: 'right',
                crossSign: 1,
                crossBase: 0
            };
        }
    }
}

/**
 * 计算主轴大小，即如果没有指定主轴大小，基于子项目的宽度计算得出
 */
function computedMainSize(style, baseOption, items) {
    if (!style[baseOption.mainSize]) {
        style[baseOption.mainSize] = 0;
        for (let item of items) {
            itemStyle = getStyle(item);
            if (itemStyle[baseOption.mainSize]) {
                style[baseOption.mainSize] += itemStyle[baseOption.mainSize];
            }
        }
        style.isAutoMainSize = true;
    }
}

/**
 * 计算子项目在flex容器中的位置，并进行布局
 */
function layoutItem(style, baseOption, items, flexLine, flexLines) {
    let {
        mainSize,
        mainStart,
        mainEnd,
        mainSign,
        mainBase,
        crossSize,
        crossStart,
        crossEnd,
        crossSign,
        crossBase
    } = baseOption;
    let mainSpace = style[mainSize];
    let crossSpace = 0;

    if (style.flexWrap === 'nowrap') {
        if (style.isAutoMainSize) {
            items.forEach(item => {
                let itemStyle = getStyle(item);
                flexLine.push(item);
                mainSpace -= itemStyle[mainSize];
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            })
        } else {
            for (let item of items) {
                let itemStyle = getStyle(item);
                let totalMainSize = items.reduce((total, item) => {
                    let itemStyle = getStyle(JSON.parse(JSON.stringify(item)));
                    return total + itemStyle[mainSize];
                }, 0);

                if (totalMainSize > style[mainSize]) {
                    if (itemStyle[mainSize]) {
                        itemStyle[mainSize] = (itemStyle[mainSize] / totalMainSize * style[mainSize]).toFixed(2);
                    } else {
                        itemStyle[mainSize] = 0;
                    }
                    flexLine.push(item);
                }
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
        }
    } else {
        for (let item of items) {
            let itemStyle = getStyle(item);
            if (!itemStyle[mainSize]) {
                itemStyle[mainSize] = 0;
            }

            if (itemStyle.flex || style.isAutoMainSize) {
                flexLine.push(item);
                if (itemStyle.flex) {
                    flexLine.flex = true;
                }
            } else {
                if (itemStyle[mainSize] > style[mainSize]) {
                    itemStyle[mainSize] = style[mainSize];
                }
                if (mainSpace < itemStyle[mainSize]) {
                    flexLine = [item];
                    flexLines.push(flexLine);
                    mainSpace = style[mainSize];
                } else {
                    flexLine.push(item);
                }
                mainSpace -= itemStyle[mainSize];
                flexLine.mainSpace = mainSpace;
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
                flexLine.crossSpace = crossSpace;
            }
        }
        if (style.flexWrap === 'wrap-reverse') {
            flexLines.reverse();
        }
    }
}

function layout(element) {
    if (!element.computedStyle) {
        return;
    }
    /**
     * 通过getStyle方法整理CSS规则的关键信息
     */
    let elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') {
        return;
    }

    /**
     * 如果子项目的CSS属性中包含order属性，通过order属性为子项目进行排序
     */
    let items = element.children.filter(item => item.type === 'element');

    items.sort(function(a, b) {
        return (a.computedStyle.order || 0) - (b.computedStyle.order || 0);
    })

    let style = elementStyle;

    console.log(style);
    /**
     * 通过调用initFlex, 初始化flex容器属性（即定义display:flex的元素中的其它flex属性的默认值）
     */
    initFlex(style);

    /**
     * 初始化元素的基本位置信息
     */
    let baseOption = initFlexPosi(style);
    let {
        mainSize,
        mainStart,
        mainEnd,
        mainSign,
        mainBase,
        crossSize,
        crossStart,
        crossEnd,
        crossSign,
        crossBase
    } = baseOption;

    /**
     * 计算flex容器主轴大小，即如果没有指定主轴大小，基于子项目的宽度计算得出
     */
    computedMainSize(style, baseOption, items);

    /**
     * 计算处理flex容器的flex-wrap属性
     */
    let flexLine = [];
    let flexLines = [flexLine];
    layoutItem(style, baseOption, items, flexLine, flexLines);
    console.log(flexLine);
    console.log(flexLines);

    for (let line of flexLines) {
        /**
         * 处理包含flex属性的子项目
         */
        if (line.flex) {
            let flexTotal = line.reduce((total, item) => {
                let itemStyle = getStyle(item);
                if (itemStyle.flex) {
                    total += itemStyle.flex;
                }
                return total;
            }, 0);
            for (let item of line) {
                let itemStyle = getStyle(item);
                if (itemStyle.flex) {
                    itemStyle[mainSize] = Number((itemStyle.flex / flexTotal * line.mainSpace).toFixed(2));
                }
            }
            line.mainSpace = 0;
        }
        /**
         * 处理flex容器的justifyContent属性
         */
        let currentMain, step;
        if (style.justifyContent === "flex-start") {
            currentMain = mainBase;
            step = 0;
        }
        if (style.justifyContent === "flex-end") {
            currentMain = line.mainSpace * mainSign + mainBase;
            step = 0;
        }
        if (style.justifyContent === "space-between") {
            step = line.mainSpace / (line.length - 1) * mainSign;
            currentMain = mainBase;
        }
        if (style.justifyContent === "space-around") {
            step = mainSpace / items.length * mainSign
            currentMain = step / 2 + mainBase;
        }
        for (let item of line) {
            let itemStyle = getStyle(item);
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd] + step;
        }
    }

    /**
     * 处理flex容器的alignContent属性
     */
    let crossSpace;
    if (!style[crossSize]) {
        crossSpace = 0;
        style[crossSize] = 0;
        for (let line of flexLines) {
            style[crossSize] += line.crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let line of flexLines) {
            crossSpace -= line.crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;

    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }
    flexLines.forEach(function(line) {
        let lineCrossSize = style.alignContent === 'stretch' ? line.crossSpace + crossSpace / flexLines.length : line.crossSpace;
        for (let item of line) {
            let itemStyle = getStyle(item);
            let align = style.alignItems;

            if (!itemStyle[crossSize]) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize] / 2);
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    })
    console.log(items)
}


module.exports = layout;