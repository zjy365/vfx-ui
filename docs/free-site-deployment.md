# 免费 VFX UI 部署交接

免费站来自本仓库 `apps/site`，当前只发布组件库、Docs 和免费相关文章。它是静态网站，不需要 Node 服务、账户数据库或 Docker。`catalog/publication.mjs` 的 `PRO_PUBLISHED=false` 暂缓所有 Pro 导航、模板页面、购买入口和相关营销内容；私有 `vfx-ui-pro` 的源码与镜像不受影响。

## 已编写的文章

生产文章保存在 `apps/site/content/blog/`，由现有 Fumadocs MDX 编译流程生成静态页面。

| 路径 | 内容 |
| --- | --- |
| `/blog/aceternity-alternatives/` | 五种 React UI 选项与各自工作方式；清楚披露 VFX UI 作者身份并引用官网 |
| `/blog/animated-hero-sections/` | 12 个实际可访问的 hero 示例，区分 DOM/SVG、WebGL、WebGPU |
| `/blog/webgpu-backgrounds/` | Registry 安装、React/Next.js 客户端边界、HTML 内容与静态 fallback 示例 |
| `/blog/nextjs-landing-page-templates/` | 已写好，但随 Pro 一起暂缓，不编入这次 Free 发布 |

文章没有编造销量、评价、性能提升、搜索量或浏览器全覆盖。旧的 `content-drafts/` 是原始参考稿，不参与构建；其中过时的价格、竞品数量、链接和性能说法不代表生产文章。

## 准备静态包

需要 Node 22+、pnpm 8.15.9、系统 tar。以下命令兼容 fish，在仓库根目录执行：

```fish
pnpm install --frozen-lockfile
pnpm release:free
```

这个命令只在本地构建和检查，不登录 Cloudflare、不上传、不发布 npm、不启动 GitHub Actions。它输出：

- `apps/docs/dist/`：供 Cloudflare Pages 使用的完整网站目录；与 `apps/site/out/` 同步。
- `output/free-site/<UTC时间>-<随机后缀>/vfx-ui-free-<UTC时间>.tar.gz`：可传输的静态站点归档。
- 同目录 `manifest.json`：基准 Git 提交、工作区是否未提交、账户链接和每个文件的大小与 SHA-256。
- 同目录 `SHA256SUMS`：归档完整性校验。

在归档目录执行 `shasum -a 256 -c SHA256SUMS`。归档只含站点文件，解压到新建的空目录后可部署；不要覆盖本机其他项目。

打包时禁用 macOS 附带的扩展属性元数据，并逐项核对真实 tar 内容的文件名、字节数和 SHA-256。发布包不会带 `._*`、环境文件、原始草稿或 Pro 源码 ZIP。`NEXT_PUBLIC_ACCOUNT_URL` 会显式覆盖本地 dotenv 文件，包括留空的情况，防止开发账户地址误入正式包。

## Cloudflare Pages 配置

使用现有 Pages 项目。若沿用 Git 集成，由操作者先将审核后的代码提交/合并到生产分支，再在 Pages 核对：

| 项目 | 值 |
| --- | --- |
| Repository root | 仓库根目录 |
| Build command | `pnpm --filter @vfx-ui/docs build` |
| Build output directory | `apps/docs/dist` |
| Node.js | 22 或与本地验证一致的受支持版本 |
| Domain | `vfx-ui.com` |
| Runtime secrets | 无 |
| `NEXT_PUBLIC_ACCOUNT_URL` | Pro 未验收时留空 |

无需 GitHub Actions 执行部署；公开 CI 仅做验证。不要为私有 Pro 仓库开收费工作流来部署免费站。

也可以由操作者上传已构建目录。本站文件数可能超过控制台拖拽的上限，因此优先用 Wrangler，而非把 tar.gz 直接拖入网页。Cloudflare 官方说明：Wrangler 接收目录，现有 Git 集成项目也支持手动创建部署，控制台拖拽则不支持这类现有项目。参见 [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)。

先查询现有项目，确认项目名称和生产分支，不新建重复站点：

```fish
npx wrangler@4 login
npx wrangler@4 pages project list
```

确认后，用实际项目名称替换下面的文字；若生产分支不是 main，也修改分支值。以下是**由你执行的正式发布命令**，准备脚本不会执行它：

```fish
set pages_project_name '替换为现有的 Pages 项目名称'
npx wrangler@4 pages deploy apps/docs/dist --project-name $pages_project_name --branch main
```

归档和 `manifest.json` 也可以一起交给另一台部署电脑：校验后解压网站目录，再对那个目录执行同样的上传命令。保留 `_headers`、`_redirects` 和所有子目录。

## Pro 准备好后再恢复入口

先完成 `account.vfx-ui.com` 的生产验收，将 `catalog/publication.mjs` 的单一开关设为 `PRO_PUBLISHED=true`，然后在免费站构建环境设置：

```fish
env NEXT_PUBLIC_ACCOUNT_URL=https://account.vfx-ui.com pnpm release:free
```

这是构建时配置，改环境变量后需要重新构建和部署免费站。不要把 Pro 的数据库、OAuth、R2、Resend 或 Creem 密钥填进 Pages。免费站只能接收公开的账户网址。

当开关为 false 时，即使本地 dotenv 或 shell 设置了账户网址，Free 发布包也会保持关闭入口。不能只设置环境变量就意外恢复 Pro。

## 上线验收

1. 首页、Docs、四篇文章、组件 Registry `/r/index.json` 和 `/sitemap.xml` 能从公网访问；内容不是登录页。
2. 确认 HTTPS、`www` 到主域重定向，文章内链正常。
3. 查看网页源代码，确认独立标题、描述、canonical 和 JSON-LD 存在；预览运行时的 `X-Robots-Tag` 在公网生效。
4. 用 Search Console 验证域名所有权并提交 sitemap；本地 SEO 检查通过不代表已收录或获得排名。
5. Pro 尚未部署时，免费站不得链接到 localhost 或不工作的账户入口。

回滚时在 Pages 选择前一个已验证部署，或重新上传上一个静态包。Pro 数据库、订单和私有源码存储不属于免费站回滚范围。
