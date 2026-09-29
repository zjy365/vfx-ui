# vfx-designer skill

面向 coding agent（Claude Code / Codex / Cursor / ZCode）的技能包：教 agent 给用户的页面
挑选、安装、配置 [VFX UI](https://vfx-ui.com) 特效组件（93 项 registry）。

## 是什么

```
skill/
├── install.sh                    # 拷贝安装脚本（幂等）
├── README.md                     # 本文件
└── vfx-designer/                 # 可整体拷贝到任意 agent 的 skills 目录
    ├── SKILL.md                  # 决策树 / hero 氛围选型表 / 安装三姿势 / 使用规约
    └── references/
        ├── catalog.md            # 全部 93 项组件目录（分类 / 一句话 / WebGPU / 安装短链）
        └── recipes.md            # 10 个常见页面配方（真实 props 默认值的示例 JSX）
```

skill 触发场景：用户想让 landing page / hero / 页面更好看、要"特效"、要装 VFX UI 组件。
agent 被触发后按 SKILL.md 的决策树选组件 → 装 → 用 props 换内容，不改库源码。

## 安装

```bash
./skill/install.sh             # 同时装到 Claude Code (~/.claude/skills) 和 ZCode (~/.zcode/skills)
./skill/install.sh claude      # 只装 Claude Code
./skill/install.sh zcode       # 只装 ZCode
```

脚本幂等：重复执行会先删除旧副本再拷贝。Cursor / Codex 等其他 agent 手动把
`skill/vfx-designer/` 整个目录拷到对应 skills 目录即可（目录结构遵循 Anthropic skill 规范：
根目录一个 SKILL.md，附加资料放 `references/`）。

## 怎么验证

装好后对 agent 说一句：

> 用 vfx-designer 给我的页面加一个 hero

预期行为（可在 agent 回复中检查）：

1. agent 读取 SKILL.md，先问或推断页面氛围（暗色科技 / 亮色编辑感 / 宇宙系…）；
2. 给出 1–3 个候选组件（如 `hero-vortex-centered`、`hero-eclipse`），说明 WebGPU 需求；
3. 执行安装：`npx shadcn@latest add https://vfx-ui.com/r/<name>.json`
   （若接了 `@vfx-ui/mcp`，则先 `vfx_search_components` 再 `vfx_get_component`）；
4. 用用户自己的文案替换演示内容（title / primaryCta 等 props），不修改
   `components/` 下的安装源码。

建议同时接入 MCP server 获得最佳体验：

```bash
claude mcp add vfx-ui -- npx -y @vfx-ui/mcp
```

## 数据来源与再生成

catalog.md 由仓库数据提炼，与发布站点对齐：

- registry：`apps/docs/public/r/registry.json`（93 项）
- WebGPU 标注：`apps/docs/public/prompts/<name>.md` frontmatter 的 `requiresWebGPU`
  （生成逻辑见 `scripts/generate-prompts.mjs`：组件直接依赖 `vgpu` 即为 true）
- 每组件机器文档：`https://vfx-ui.com/components/<name>.md`
- AI builder prompt：`https://vfx-ui.com/prompts/<name>.md`

库更新后需人工同步 catalog.md / recipes.md。
