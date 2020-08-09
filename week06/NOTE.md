[TOC]

# week 6

## CSS(2.1)总体结构

- @charset
- @import
- rules
  - @media
  - @page
  - rule

### css结构框架

> - CSS
>   - at-rules
>     - @charset
>     - @import
>     - **@media**
>     - @page
>     - @counter-style
>     - **@keyframes**
>     - **@fontface**
>     - @support
>     - @namespace
>   - rule
>     - Selector
>       - selector_group
>       - selector
>         - \>
>         - <sp>空格
>         - \+
>         - \~
>       - simple_selector
>         - type
>         - \*
>         - \.
>         - #
>         - []
>         - :
>         - ::
>         - :not()
>     - Declaration
>       - Key
>         - variables
>         - properties
>       - Value
>         - calc
>         - number
>         - length
>         - ......
>
> **备注：**加粗的为需要着重记忆的。

## At-rules

- @charset：https://www.w3.org/TR/css-syntax-3/
- @import: https://www.w3.org/TR/css-cascade-4/
- @media: https://www.w3.org/TR/css3-conditional/
- @page: https://www.w3.org/TR/css-page-3/
- @counter-style: https://www.w3.org/TR/css-counter-styles-3
- @keyframes: https://www.w3.org/TR/css-animations-1/
- @fontface: https://www.w3.org/TR/css-fonts-3/
- @supports: https://www.w3.org/TR/css3-conditional/
- @namespace: https://www.w3.org/TR/css-namespaces-3/

## rules

- 选择器
- 声明
  - key
  - value

### 标准总结

- Selector
  - https://www.w3.org/TR/selectors-3/
  - https://www.w3.org/TR/selectors-4/
- Key
  - Properties
  - Variables: https://www.w3.org/TR/css-variables
- Value
  - https://www.w3.org/TR/css-values-4/

## 选择器语法

### 简单选择器

- \*	选中所有元素。
- div svg|a    叫做类型选择器（type selector），选择的是元素的tagName属性
- .cls   类选择器（class selector）
- #id   id选择器
- [attr=value]   属性选择器
- :hover   伪类选择器，主要是一些元素的特殊状态
- ::before    伪元素选择器，选中以

### 复合选择器

- <简单选择器><简单选择器><简单选择器>
- \* 或者 div 必须写在最前面

### 复杂选择器

- <复合选择器><sp><复合选择器>
- <复合选择器>">"<复合选择器>
- <复合选择器>"~"<复合选择器>
- <复合选择器>"+"<复合选择器>
- <复合选择器>"||"<复合选择器>

### 伪类选择器

- 链接/行为
  - :any-link
  - :link :visited
  - :hover
  - :active
  - :focus
  - :target
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child :last-child :only-child
- 逻辑型
  - :not
  - :where :has

### 伪元素选择器

伪元素就是通过选择器，向界面上添加了一个不存在的元素：

- ::before

- ::after

  ```
  <div>
  <::before/>
  content content content content
  content content content content
  content content content content
  content content content content
  content content content content
  <::after/>
  </div>
  ```

- ::first-line

- ::first-letter

  ```
  <div>
  <::first-letter>c</::first-letter> content content content content
  content content content content
  content content content content
  content content content content
  content content content content
  content content content content
  </div>
  ```

#### first-line和first-letter中可已使用的属性

- first-line
  - font系列
  - color系列
  - background系列
  - word-spacing系列
  - letter-spacing
  - text-decoration
  - text-transform
  - line-height
- first-letter
  - font系列
  - color系列
  - background系列
  - text-decoration
  - text-transform
  - letter-spacing
  - word-spacing
  - line-height
  - float
  - vertical-align
  - 盒模型系列：margin，padding，border

