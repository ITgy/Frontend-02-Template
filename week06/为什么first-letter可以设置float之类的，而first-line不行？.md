# 为什么first-letter可以设置float之类的，而first-line不行？

我的理解是，first-line如果设置了float，会导致这一行脱离标准流，从而第二行会移动到这一行下面，就会出问题，所以first-line不可以设置float属性。而first-letter只针对这一行中的第一个字，就算设置了float属性，这一行也不会脱离标准流，所以first-letter可以设置float属性。