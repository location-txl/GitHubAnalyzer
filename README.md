# GitHub Analyzer / GitHub 分析器

一个功能强大的 GitHub 仓库分析工具，支持中英文双语界面。

A powerful GitHub repository analysis tool with bilingual support (Chinese/English).

## 功能特性 / Features

- 🔍 **仓库搜索** / Repository Search
- 📊 **代码统计** / Code Statistics  
- 👥 **贡献者分析** / Contributor Analysis
- 📈 **活动追踪** / Activity Tracking
- 🔄 **仓库比较** / Repository Comparison
- 🌐 **多语言支持** / Multi-language Support
- 📤 **数据导出** / Data Export
- 🤖 **AI README 分析** / AI README Analysis

## 语言切换 / Language Switching

应用支持中英文切换，点击右上角的语言切换按钮即可。语言设置会自动保存到本地存储。

The application supports Chinese/English switching. Click the language switcher button in the top right corner. Language settings are automatically saved to local storage.

## 技术栈 / Tech Stack

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **图表**: Chart.js + react-chartjs-2
- **图标**: Lucide React
- **国际化**: react-i18next
- **构建工具**: Vite
- **日期处理**: date-fns

## 开发 / Development

```bash
# 安装依赖 / Install dependencies
npm install

# 启动开发服务器 / Start development server
npm run dev

# 构建生产版本 / Build for production
npm run build
```

## 国际化配置 / i18n Configuration

翻译文件位于 `src/i18n/locales/` 目录：
- `en.json` - 英文翻译
- `zh.json` - 中文翻译

Translation files are located in `src/i18n/locales/`:
- `en.json` - English translations
- `zh.json` - Chinese translations

## 环境变量 / Environment Variables

创建 `.env` 文件并配置以下变量：

```env
VITE_APP_AI_API_URL=your_ai_api_url
VITE_APP_AI_API_TOKEN=your_ai_api_token
VITE_APP_AI_MODEL=your_ai_model
VITE_APP_GITHUB_DEF_TOKEN=your_github_token
```

## 使用说明 / Usage

1. **添加 GitHub Token** / Add GitHub Token
   - 点击右上角的"添加令牌"按钮
   - 输入您的 GitHub Personal Access Token
   - Click "Add Token" button in the top right
   - Enter your GitHub Personal Access Token

2. **搜索仓库** / Search Repository
   - 在搜索框中输入仓库名称（如：facebook/react）
   - Enter repository name in search box (e.g., facebook/react)

3. **查看分析结果** / View Analysis
   - 查看仓库统计信息、代码分布、贡献者等
   - View repository statistics, code distribution, contributors, etc.

4. **比较仓库** / Compare Repositories
   - 点击"比较"按钮将仓库添加到比较列表
   - Click "Compare" button to add repositories to comparison

5. **导出数据** / Export Data
   - 支持导出 JSON 和 CSV 格式
   - Support JSON and CSV export formats

## 许可证 / License

MIT License 