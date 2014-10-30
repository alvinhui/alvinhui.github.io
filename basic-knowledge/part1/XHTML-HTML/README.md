# HTML, XHTML

## HTML与XHTML的区别

HTML（HyperText Markup Language，超文本标记语言）最早的HTML官方正式规范，是1995年IETF（Internet Engineering Task Force，因特网工程任务组）发布的HTML 2.0。W3C（World Wide Web Consortium，万维网联盟）继IETF之后，对HTML进行了几次升级，直至1999年发布HTML 4.01。

### HTML与XHTML

可扩展超文本标记语言XHTML（eXtensible HyperText Markup Language），是HTML 4.01的第一个修订版本，是「3种HTML4文件根据XML1.0标准重组」而成的。也就是说是，XHTML是HTML 4.01和XML1.0的杂交。

由于XHTML1.0是基于HTML4.01的，并没有引入任何新标签或属性（XHTML可以看作是HTML的一个子集），表现方式与超文本标记语言HTML类似，只是语法上更加严格，几乎所有的网页浏览器在正确解析HTML的同时，可兼容XHTML。

如：XHTML中所有的标签必须小写，所有标签必须闭合，每一个属性都必须使用引号包住。`<br>`要写成`<br />`，不能写为`<BR />`（同hr）；使用了`<p>`之后必须有一个`</p>`以结束段落。

### HTML与XML

HTML是一种基于标准通用标记语言（SGML）的应用，而XHTML则基于可扩展标记语言（XML），HTML和XHTML其实是平行发展的两个标准。本质上说，XHTML是一个过渡技术，结合了部分XML的强大功能及大多数HTML的简单特性。建立XHTML的目的就是实现HTML向XML的过渡。

XML设计用来传送及携带数据信息，不用来表现或展示数据，HTML语言则用来表现数据。RSS和ATOM目前已经成为成功的XML应用，RSS使用XML作为彼此共享内容的标准方式。它代表了Really Simple Syndication（或RDF Site Summary，RDF站点摘要）。它能让别人很容易的发现你已经更新了你的站点。Atom数据源似乎较少了些；对开发者来说，RSS相对简单，Atom稍显复杂，特别是如果不熟悉XML。

1997年，W3C在发布XML1.0标准时，HTML的版本已经到了4。直到2000年1月26日XHTML1.0成为W3C的推荐标准。不过，鉴于当时HTML一统天下的现状，W3C只好建议」继续使用HTML4.01和积极地研究HTML5及XHTML的计划」。2002年W3C指出XHTML家族将会是Internet的新阶段，并又着手开发XHTML2，旨在把Web引向建立在XML之上的无比光明的美好未来。

### HTML5大行其道
　　
由于原本XHTML只是在内容结构上改进原有的HTML系统，XHTML2.0也仅仅在XHTML1.1的基础上更加注重页面规范和可用性，缺乏交互性。在这个Web App大行其道的年代，XHTML2有些OUT了，于是就催生了HTML5。

W3C无视Web设计人员的需求，仅从理论角度闭门造车，却扛着标准的大旗，引发了来自Opera、Apple以及Mozilla等浏览器厂商的反对声音。2004年，他们组建了一个以推动网络HTML5标准为目的的组织——网页超文本技术工作小组（Web Hypertext Application Technology Working Group，缩写为WHATWG）。

### HTML5和XHTML2的竞争

HTML5目标是取代1999年所制定的HTML4.01和XHTML1.0标准，旨在提高网页性能，增加页面交互。HTML5吸取了XHTML2一些建议，包括一些用来改善文档结构的功能，比如，新的HTML标签header、footer、dialog、aside、figure等的使用，将使内容创作者更加语义地创建文档，之前的开发者在这些场合是一律使用div的。

W3C与WHATWG双方经过多年努力，终于在2006年达成妥协。2006年10月，Web之父、万维网联盟（W3C）主席、美国国家科学院院士蒂姆·伯纳斯-李（Tim Berners-Lee）发表了一篇博客文章表示，从HTML走向XML的路是行不通的（XHTML is dead）。2009年W3C明智的放弃了改进XHTML2.
0标准的计划，选择了WHATWG的成果作为基础。事实上，XHTML在2002年更新之后的数年时间里，尽管发现了众多问题，但都没有去修改过。

2011年，Google工程师兼HTML5标准编辑的Ian Hickson称，HTML5将是最后一个带版本号的HTML语言。他表示，HTML语言将成为一个活的标准。