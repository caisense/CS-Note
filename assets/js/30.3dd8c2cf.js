(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{311:function(t,a,s){"use strict";s.r(a);var n=s(14),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("img",{attrs:{src:"images/RPC/v2-ff075d7ff3df91d0fbce357456828d1e_720w.jpg",alt:"v2-ff075d7ff3df91d0fbce357456828d1e_720w"}}),t._v(" "),a("h1",{attrs:{id:"feign"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#feign"}},[t._v("#")]),t._v(" Feign")]),t._v(" "),a("p",[t._v("Feign是Netflix开发的声明式、模板化的HTTP客户端。Spring Cloud openfeign对Feign进行了增强，使其支持Spring MVC注解，另外还整合了Ribbon和Eureka。")]),t._v(" "),a("p",[a("strong",[t._v("feign的作用")]),t._v("：替代原有的http方式，用本地接口调用的方式完成http请求。虽然性能较低，但是增加了可读性。")]),t._v(" "),a("p",[t._v("feign之前JAVA 项目中如何实现接口http调用？")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("Httpclient")]),t._v(" "),a("p",[t._v("是 Apache Jakarta Common 下的子项目，用来提供高效的、最新的、功能丰富的支持 Http 协议的客户端编程工具包，并且它支持 HTTP 协议最新版本和建议 相比传统 JDK 自带的URLConnection，提升了易用性和灵活性，使客户端发送 HTTP 请求变得容易，提高了开发的效率。")])]),t._v(" "),a("li",[a("p",[t._v("HttpURLConnection")]),t._v(" "),a("p",[t._v("是 Java 的 "),a("strong",[t._v("标准类")]),t._v("，它继承自 URLConnection，可用于向指定网站发送 GET 、POST 请求。HttpURLConnection 使用比较复杂，不像 HttpClient 那样容易使用。")])]),t._v(" "),a("li",[a("p",[t._v("Okhttp")]),t._v(" "),a("p",[t._v("一个处理网络请求的开源项目，是"),a("strong",[t._v("安卓端")]),t._v("最火的轻量级框架，由 Square 公司贡献，用于替代 HttpUrlConnection 和 HttpClient。OkHttp 拥有简洁的 API、高效的性能，并支持多种协议（HTTP/2 和 SPDY）。")])]),t._v(" "),a("li",[a("p",[t._v("RestTemplate")]),t._v(" "),a("p",[t._v("是 "),a("strong",[t._v("Spring")]),t._v(" 提供的用于访问 Rest 服务的客户端，RestTemplate 提供了多种便捷访问远程HTTP 服务的方法，能够大大提高客户端的编写效率。")])])]),t._v(" "),a("h2",{attrs:{id:"q-为什么feign第一次调用耗时较长"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#q-为什么feign第一次调用耗时较长"}},[t._v("#")]),t._v(" Q：为什么feign第一次调用耗时较长？")]),t._v(" "),a("p",[t._v("内置ribbon，是懒加载")]),t._v(" "),a("h2",{attrs:{id:"设计架构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#设计架构"}},[t._v("#")]),t._v(" 设计架构")]),t._v(" "),a("img",{staticStyle:{zoom:"67%"},attrs:{src:"images/RPC/image-20230411235608927.png",alt:"image-20230411235608927"}}),t._v(" "),a("p",[t._v("Feign 中默认使用 JDK 原生的 URLConnection 发送 HTTP 请求。可以集成别的组件替换URLConnection，比如 Apache HttpClient、OkHttp。\nFeign发起调用真正执行逻辑："),a("strong",[t._v("feign.Client#execute")])]),t._v(" "),a("p",[t._v("例：配置 OkHttp 依赖：")]),t._v(" "),a("div",{staticClass:"language-xml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-xml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("dependency")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("groupId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("io.github.openfeign"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("groupId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("artifactId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("feign‐okhttp"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("artifactId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("dependency")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("  \n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br")])]),a("p",[t._v("yml：")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("feign")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#feign 使用 okhttp")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("httpclient")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("enabled")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("false")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("okhttp")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("enabled")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("  \n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br")])]),a("h1",{attrs:{id:"dubbo"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dubbo"}},[t._v("#")]),t._v(" Dubbo")])])}),[],!1,null,null,null);a.default=e.exports}}]);