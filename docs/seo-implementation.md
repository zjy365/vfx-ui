# VFX UI 站内 SEO 实施记录

当前状态：2026-11-01 已将 Free-only 产物部署至现有 Cloudflare Pages 正式站，未触发 GitHub Actions。公开内容为 113 个规范页面，包括 93 个组件、5 篇 Docs 和 3 篇文章。Pro 相关路由、导航和模板文章暂缓；下表中的完整产品规划保留作后续恢复参考。源码仍在本地工作区，未提交或推送，尚未提交 Search Console 索引。

## 参考与取舍

参考所有者的本机学习笔记「哥飞建站教程」第 05 章（站内 SEO）、第 06 章（内容树）、第 07 章（收录与推广）。采用页面主题明确、正文可抓取、内容树与内链、规范网址、分享信息这些做法。目标短语依据实际产品内容制定；尚无该站 Search Console 数据，也没有验证关键词搜索量、竞争难度或现有排名，不将它们称为已验证的流量机会。

对照 Google 官方资料纠正以下经验说法：

- Google 可以执行 JavaScript；本项目仍采用静态 HTML，减少对渲染队列的依赖。见 [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)。
- 不设 600 字最低字数或 3% 关键词密度，不添加 keywords 标签。自然解释实际用途，避免重复填词。见 [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)。
- 标题清楚、简洁并区分页面，不把 60 字符视作排名规则。见 [Title links](https://developers.google.com/search/docs/appearance/title-link)。
- 不把所有外部链接改成 nofollow，不编造评价、评分、销量或可售状态。

## 页面分工

| 页面 | 对应主题 | 本轮变化 |
| --- | --- | --- |
| `/` | Free React components、animated backgrounds | 标题、H1、简介与源码安装说明；链接到 hero、背景和 footer 分类 |
| `/components/` | 免费 React 组件库 | 明确 H1、7 个分类的 HTML 文本链接、CollectionPage 数据 |
| 7 个分类页 | React hero sections、animated backgrounds、footers、blocks、hover effects、text、glass | 各自的标题、描述和 H1，实际组件列表与安装/兼容性指南入口 |
| 93 个组件页 | 组件名称 + React 用途 | 保留原 URL，标题和 H1 增加用途；面包屑与源码结构化数据，补充指南内链 |
| `/docs/` 与 5 篇指南 | React/Next.js 安装、兼容性、AI agents、Free/Pro、许可证 | 独立描述、规范网址、分享卡片、TechArticle 与面包屑；首页按用途连接分类 |
| `/templates/` 与 6 个模板页 | Next.js 网站、agency、marketing、research、SaaS、startup、issue tracker templates | 搜索标题突出用途；演示品牌保留在页面；不输出可购买 Offer 或虚构评分 |
| `/blog/` 与 4 篇文章 | React UI 选型、hero 示例、WebGPU 背景、Next.js 模板选择 | 原创正文、目录、实际组件内链、Article 与面包屑；不假设已开售 |
| Privacy、Terms | 隐私与使用条款 | 独立描述、规范网址与分享信息 |

每页独立输出完整 OG/Twitter 信息，避免 Next.js 的浅合并使组件图片覆盖时丢失文字或 URL。JSON-LD 在静态 HTML 中输出，并转义 `<`，防止字符串提前关闭脚本。

## 收录规则

- 122 个主要规范页面进入 sitemap，Docs 和文章从实际内容源生成，避免新增内容漏列。
- 查询参数不会进入规范网址，既有组件和模板路径不改名。
- 组件预设页继续合并到主组件规范网址，不在 sitemap 重复列出。
- 未经人工策划的 tag 筛选页、全屏预览页与示例全屏页使用 `noindex, follow`。
- 嵌入式 `/preview-runtime/index.html` 使用 Cloudflare Pages `X-Robots-Tag` 响应头防止独立收录；不阻止抓取用于渲染的 JS/CSS。
- 四篇正式文章另写在 `apps/site/content/blog/`，已加入本地静态发布包，尚未部署。原有未跟踪的 `content-drafts/` 保持原样，不参与构建。

## 本地验证

```fish
pnpm --filter @vfx-ui/docs build
pnpm seo:check
pnpm --filter @vfx-ui/docs typecheck
pnpm --filter @vfx-ui/docs test
pnpm catalog:check
```

上述检查全部通过。`seo:check` 直接读取构建产物，使用 DOM 解析静态 HTML，检查 sitemap 内全部 122 页：唯一标题/描述、单一 H1、自指规范网址、OG/Twitter 一致性、分享图片存在、JSON-LD 有效且无虚构商业数据。另检查 utility 页的 noindex、预设页的规范网址、预览运行时响应头配置、文章内链与目录锚点，以及正式 HTML 不含 localhost 账户入口。

通过 HTML 链接建立抓取图，确认所有 sitemap 页面可从首页到达，实际最大点击深度为 2。既有 4 项组件交互回归通过。浏览器检查首页与文档页的实际布局；这不替代真实用户性能数据或移动设备验收。

公开 CI 已添加同一 SEO 检查，之后正常构建时执行；本轮未推送，未启动任何远端工作流，也未改变账单或额度。

## 正式上线后仍需验收

1. 确认正式域名、HTTPS 与 `www` 到主域的重定向；预览环境不要作为正式索引入口。
2. 从公网检查 sitemap 和响应头实际生效，再通过 Search Console 验证所有权并提交 sitemap。
3. 用 URL Inspection 检查首页、一个分类页、一个组件页和安装文档的抓取情况；本地通过不等于已经收录。
4. 收集索引、查询曝光、点击率及真实用户性能数据后，再决定优先改哪些页面。没有固定收录或排名承诺。
5. 四篇文章的实际搜索表现需上线后观察。进一步关键词研究和推广另行逐项处理；本轮不向社区发帖、不买外链、不购买 SEO 服务。
