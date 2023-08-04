(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{289:function(t,a,s){"use strict";s.r(a);var e=s(14),n=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"哈希算法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#哈希算法"}},[t._v("#")]),t._v(" 哈希算法")]),t._v(" "),a("p",[t._v("哈希算法（Hash）又称摘要算法（Digest），作用：对任意一组输入数据进行计算，得到一个固定长度的输出摘要。")]),t._v(" "),a("p",[t._v("哈希算法的目的就是为了验证原始数据是否被篡改。")]),t._v(" "),a("p",[a("strong",[t._v("特点")])]),t._v(" "),a("ul",[a("li",[t._v("相同的输入一定得到相同的输出；")]),t._v(" "),a("li",[t._v("不同的输入大概率得到不同的输出。")])]),t._v(" "),a("p",[a("strong",[t._v("哈希碰撞")])]),t._v(" "),a("p",[t._v("两个不同的输入得到了"),a("strong",[t._v("相同")]),t._v("的输出，碰撞是不可避免的，碰撞概率的高低关系到哈希算法的安全性。一个安全的哈希算法必须满足：")]),t._v(" "),a("ul",[a("li",[t._v("碰撞概率低；")]),t._v(" "),a("li",[t._v("不能猜测输出。")])]),t._v(" "),a("p",[a("strong",[t._v("常用哈希算法")])]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("算法")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("输出长度（位）")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("输出长度（字节）")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("MD5")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("128 bits")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("16 bytes")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("SHA-1")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("160 bits")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("20 bytes")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("RipeMD-160")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("160 bits")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("20 bytes")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("SHA-256")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("256 bits")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("32 bytes")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("SHA-512")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("512 bits")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("64 bytes")])])])]),t._v(" "),a("p",[t._v("根据碰撞概率，哈希算法的"),a("strong",[t._v("输出长度越长")]),t._v("，就越难产生碰撞，也就越安全。")]),t._v(" "),a("h2",{attrs:{id:"用途"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#用途"}},[t._v("#")]),t._v(" 用途")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("验证数据、文件是否被篡改")]),t._v(" "),a("p",[t._v("自己计算一下本地文件的哈希值，再与官网公开的哈希值对比，如果相同，说明文件下载正确，否则，说明文件已被篡改。")])]),t._v(" "),a("li",[a("p",[t._v("存储用户口令")]),t._v(" "),a("p",[t._v("如果直接将用户的原始口令存放到数据库中，会产生极大的安全风险：")]),t._v(" "),a("ul",[a("li",[t._v("数据库管理员能够看到用户明文口令；")]),t._v(" "),a("li",[t._v("数据库数据一旦泄漏，黑客即可获取用户明文口令。")])]),t._v(" "),a("p",[t._v("不存储用户的原始口令，那么如何对用户进行认证？方法是存储用户口令的哈希，例如，MD5。")]),t._v(" "),a("p",[t._v("在用户输入原始口令后，系统计算用户输入的原始口令的MD5并与数据库存储的MD5对比，如果一致，说明口令正确，否则，口令错误。")]),t._v(" "),a("p",[t._v("因此，数据库存储用户名和口令的表内容应该像下面这样：")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("username")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("password")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("bob")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("f30aa7a662c728b7407c54ae6bfd27d1")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("alice")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("25d55ad283aa400af464c76d713c07ad")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("tim")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("bed128365216c019988915ed3add75fb")])])])]),t._v(" "),a("p",[t._v("这样一来，数据库管理员看不到用户的原始口令。即使数据库泄漏，黑客也无法拿到用户的原始口令。想要拿到用户的原始口令，必须用暴力穷举的方法，一个口令一个口令地试，直到某个口令计算的MD5恰好等于指定值。")])])]),t._v(" "),a("p",[a("strong",[t._v("彩虹表")])]),t._v(" "),a("p",[t._v("使用哈希口令时，还要注意防止"),a("strong",[t._v("彩虹表")]),t._v("攻击。彩虹表就是常用口令的哈希表，如果用户使用了常用口令，黑客从MD5一下就能反查到原始口令")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("常用口令")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("MD5")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("hello123")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("f30aa7a662c728b7407c54ae6bfd27d1")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("12345678")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("25d55ad283aa400af464c76d713c07ad")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("passw0rd")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("bed128365216c019988915ed3add75fb")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("19700101")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("570da6d5277a646f6552b8832012f5dc")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("…")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("…")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("20201231")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("6879c0ae9117b50074ce0a0d4c843060")])])])]),t._v(" "),a("p",[a("strong",[t._v("解决办法")])]),t._v(" "),a("p",[t._v("加盐（salt）：对每个口令额外添加随机数。目的在于使黑客的彩虹表失效，即使用户使用常用口令，也无法从MD5反推原始口令。")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("digest = md5(salt+inputPassword)\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("加盐处理后的数据库表：")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("username")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("salt")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("password")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("bob")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("H1r0a")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("a5022319ff4c56955e22a74abcc2c210")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("alice")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("7$p2w")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("e5de688c99e961ed6e560b972dab8b6a")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("tim")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("z5Sk9")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("1eee304b92dc0d105904e7ab58fd2f64")])])])]),t._v(" "),a("p",[t._v("java用信息摘要类MessageDigest计算哈希：")]),t._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("main")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" args"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("throws")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Exception")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建一个MessageDigest实例，并指定使用的哈希算法:")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MessageDigest")]),t._v(" md "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MessageDigest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"SHA-1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 支持常用哈希算法")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 反复调用update输入数据:")]),t._v("\n    md"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("update")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBytes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"UTF-8"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    md"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("update")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"World"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBytes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"UTF-8"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 计算哈希")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("byte")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" result "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" md"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("digest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 20 bytes: db8ac1c259eb89d4a131b253bacfca5f319d54f2")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BigInteger")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" result"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("toString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("16")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br")])])])}),[],!1,null,null,null);a.default=n.exports}}]);