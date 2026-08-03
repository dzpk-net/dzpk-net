# dzpk.net — 中文德州扑克资讯

同步 Telegram 频道 [@puke](https://t.me/puke) 的中文扑克资讯站：WSOP、WPT、RSOP、USOP 等赛事追踪，牌局动态、选手战绩与策略讨论，每日更新。

网站 <https://dzpk.net> · 频道 <https://t.me/puke> · 订阅 <https://dzpk.net/rss.xml>

## 怎么读

- [首页](https://dzpk.net/) — 最新内容，与频道实时同步
- [标签目录](https://dzpk.net/tags) — 按主题浏览，常看的有 [WSOP](https://dzpk.net/tag/WSOP)、[赛事战报](https://dzpk.net/tag/%E8%B5%9B%E4%BA%8B%E6%88%98%E6%8A%A5)、[扑克策略](https://dzpk.net/tag/%E6%89%91%E5%85%8B%E7%AD%96%E7%95%A5)、[高额赛事](https://dzpk.net/tag/%E9%AB%98%E9%A2%9D%E8%B5%9B%E4%BA%8B)、[扑克明星](https://dzpk.net/tag/%E6%89%91%E5%85%8B%E6%98%8E%E6%98%9F)
- [归档](https://dzpk.net/archive) — 按月翻阅全部一千四百多篇
- 搜索 — 全站中文全文检索，如 [/search/WSOP](https://dzpk.net/search/WSOP)
- [每周摘选](https://github.com/dzpk-net/weekly) — 一周里值得回看的内容，按主题分组，每周一更新

## 关于这个站

内容全部来自 Telegram 频道，网站只负责呈现：消息发进频道，几分钟内就出现在站上。没有第二套后台，也没有第二份内容。

技术上是 [BroadcastChannel](https://github.com/miantiao-me/BroadcastChannel) 的一个定制版本，整站跑在 Cloudflare 上——Workers 负责渲染，KV 做页面缓存，D1 存全文索引（FTS5 配 trigram 分词，为中文准备）。服务端出 HTML，不带前端框架。

给模型看的站点摘要在 <https://dzpk.net/llms.txt>。
