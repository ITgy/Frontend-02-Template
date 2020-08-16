[TOC]

# week7

## CSS排版

### 盒(Box)

**标签(Tag)、元素(Element)、盒(Box)的区别：**

- HTML代码中可以书写开始**标签**，结束**标签**，和自封闭**标签**。
- 一对起止**标签**，表示一个**元素**。
- DOM树中存储的是**元素**和其它类型的节点（Node）。
- CSS选择器选中的是**元素**。
- CSS选择器选中的**元素**，在排版时可能产生多个**盒**。
- 排版和渲染的基本单位是**盒**。

**盒模型**

- box-sizing:

  - content-box

    > 1. 在content-box盒模型下，width和height指的是content的宽度，即内容的宽度，不包括内外边距(padding&margin)以及边框。

  - border-box

    > 1. 在border-box盒模型下，width和height值得是content的宽度加上内边距(padding)以及边框(border)。

- padding：内边距，主要影响盒内的排版，决定了盒里面可排布的空间大小
- margin：外边距，主要影响盒本身的排版，决定了这个盒周围的空白区域的大小

### 正常流

**CSS排版技术：**

- 第一代：基于正常流和正常流里面的一些基础设施的排版
- 第二代：基于flex技术的排版（当前主流）
- 第三代：基于grid的排版

**正常流：**

1. 排版可以简单的理解为，把每个字安排到哪个位置，把每个盒子安排到哪个位置。
2. 正常流排版：
   - 收集**盒**和**文字**进行(hang)
   - 计算盒和文字在行中的排布
   - 计算行的排布
3. inline-level-box：行内级别的盒，在一行中排布
4. block-level-box：块级盒，单独占一行
5. line-box：行盒，文字和inline-level-box排除来的这种行就叫做行盒
6. 整体来看，正常流就是由一个一个的line-box和block-level-box的从上到下的排布。每个line-box内部是一个从左到右的排布方式
7. 排布块级的称为BFC（block-level-formatting-context块级格式化上下文），排布行内的称为IFC（inline-level-formatting-context行内级格式化上下文）

**正常流的行级排布：**

- Baseline: 基线
- 行模型：五条线
  - line-top：如果行高大于文字的高度的时候，便会有line-top
  - text-top：文字大小不变，text-top位置就不会变化，多种字体排列，是由fontSize最大的一个字体决定text-top位置。
  - base-line
  - text-bottom
  - line-bottom
- 盒的先后顺序和盒的尺寸都会影响line-top和line-bottom的位置，不会影响text-top和text-bottom的位置
- 可以通过为行内盒设置vertical-align属性来决定其与文字的对其方式。（第七周第三节9:45）

**正常流的块级排布：**

- float与clear的机制：
  - 严格来说浮动元素已经脱离了正常流，但是它是一个依附于正常流去定义的一类元素的排布方式
  - float的基本规则：float可以视为先把这个元素排到页面的某个特定的位置，当它是正常流里的元素，如果它上面有float然后就朝着这个方向去挤一下，比如有float：left；就朝左挤一下。然后根据float元素占据的区域，会调整行盒的位置。因为在计算位置的时候，还没有去计算每一个文字具体的位置，所以理论上讲这个地方这个文字也是不需要重排的。只是说会把行盒的宽度根据float产生的占据的宽度然后进行调整。float显著的特征就是会影响生成的这些行盒的尺寸。
  - 当一个float的元素出现了以后，它不知影响自己所在的这一行，凡是它的高度所占据的范围内，所有的行盒都会根据这个float的元素的尺寸，调整自己的大小，超出了float的范围，就不受影响了
  - clear属性并不是清除浮动的意思，而是找一块更加干净的空间来执行浮动操作。用于解决浮动叠加问题。
  - 当给每个元素都加上一个float的时候，元素之间的表现类似一个正常流。
  - float布局无法解析<br/\>标签，如果加上<br/\>只是为正常流执行换行
  - 若想在float中实现换行，需要通过clear属性
  - BFC中有一个现象，就是margin边距折叠

**BFC合并**

- Block Container：里面有BFC的（能容纳正常流的盒子，里面就有BFC）

  **display的效果：**

  - block
  - inline-block
  - table-cell
  - flex item
  - grid cell
  - table-caption

- Block-level Box：外面有BFC的

  - Block level
    - display: block
    - display: flex
    - display: table
    - display: grid
    - ......
  - Inline level
    - display: inline-block
    - display: inline-flex
    - display: inline-table
    - display: inline-grid
    - ......
  - display: run-in

- Block Box = Block Container + Block-leve Box: 里外都有BFC的

- block box && overflow: visible
  - BFC合并与float
  - BFC合并与边距折叠

**Flex排版**

- 收集**盒**进行(hang)
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布

- 分行
  - 根据主轴尺寸，把元素分进行
  - 若设置了no-wrap,则强行分配进第一行
- 计算主轴方向
  - 找出所有Flex元素
  - 把主轴方向的剩余尺寸按比例分配给这写元素
  - 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
- 计算交叉轴方向
  - 根据每一行中最大元素尺寸计算行高
  - 根据行高flex-align和item-align,确定元素具体位置

**Animation**

- @keyframes定义

  ```
  @keyframes mykf {
  	0% {top:0;transition:top ease}
  	50% {top:30px;transition:top ease-in}
  	75% {top:10px;transition:top ease-out}
  	100% {top:0;transition:top linear}
  }
  ```

- animation：使用

  - animation-

    - name 时间曲线
    
    - duration 动画的时长
    
    - timing-function 动画的时间
  
- delay 动画开始前的延迟
  
    - iteration-count 动画的播放次数
    
    - direction 动画的方向
    

**Transition**

- transition-property 要变换的属性；
- transition-duration 变换的时长；
- transition-timing-function 时间曲线；
- transition-delay 延迟

