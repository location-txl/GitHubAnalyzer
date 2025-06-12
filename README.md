# GitHub Analyzer

GitHub Analyzer 是一款使用 React 18 和 TypeScript 打造的 GitHub 库分析工具。它支持中英文界面，提供多种常用的库数据查询和分析功能，便于你对项目进行快速了解和比对。

## 功能介绍

- 搜索任意公开仓库
- 统计代码用量与语言分布
- 查看热门仓库排行榜
- 查看项目各类图表统计和动态活动
- 进行多个项目数据对比
- 将数据导出为 JSON 或 CSV 文件
- 在页面上生成自动的 README 分析

## 开发环境

先确保 Node.js 版本符合要求，然后安装依赖并启动服务：

```bash
npm install
npm run dev
```

若需构建生产版：

```bash
npm run build
```

## 环境变量

项目需要配置下列环境变量，并将它们写入 `.env` 文件：

```env
VITE_APP_AI_API_URL=<AI 服务地址>
VITE_APP_AI_API_TOKEN=<AI 认证凭证>
VITE_APP_AI_MODEL=<AI 模型名>
VITE_APP_GITHUB_DEF_TOKEN=<GitHub 默认 Token>
```

## 使用指南

1. 在页面上点击“设置”，添加或删除 GitHub Token，以增加 API 限制
2. 从页面顶部搜索目标仓库
3. 查看代码统计、贡献者和最近活动
4. 加入比较列表，会显示多个库的关键资料
5. 可以导出 JSON 或 CSV 格式以供下载
6. 启用 AI README 分析，得到项目概览

## 技术栈

- React 18 + TypeScript
- Tailwind CSS 风格化
- Chart.js 统计图表
- Supabase 作为数据库 API
- Vite 开发和构建工具
- i18next 多语言支持

## 版权协议

项目使用 MIT License 协议发布。
