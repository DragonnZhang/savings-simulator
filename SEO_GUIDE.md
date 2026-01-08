# SEO 优化指南

本文档记录了为积蓄模拟器项目实施的 SEO 优化措施。

## 已实施的优化

### 1. **元数据优化 (Metadata)**

✅ **多语言元数据**

- 为中文 (zh) 和英文 (en) 分别设置优化的 title, description 和 keywords
- 中文版本使用"积蓄模拟器"、"财务规划"、"储蓄计算器"等关键词
- 英文版本使用"Savings Simulator"、"Financial Planning"等关键词

✅ **Open Graph 标签**

- 为每个语言版本配置 og:title, og:description, og:url, og:locale
- 支持社交媒体分享时的正确显示

✅ **Robots 元标签**

- 配置 index: true 和 follow: true，允许搜索引擎索引和跟随链接

### 2. **站点地图和爬虫规则**

✅ **robots.txt**

- 位置: `public/robots.txt`
- 允许所有搜索引擎爬虫 (Google, Baidu, Bing, Yahoo)
- 声明 sitemap 位置
- 特别允许百度爬虫 (Baiduspider)，因为用户在 Google 搜索"积蓄模拟器"，百度也是重要渠道

✅ **动态 Sitemap**

- 位置: `src/app/sitemap.ts`
- 自动生成 XML sitemap，包含所有语言版本的页面
- 为中文版本设置更高优先级 (0.9) 以提升排名

✅ **robots.ts**

- Next.js 动态 robots 文件
- 配置爬虫规则和 sitemap 引用

### 3. **国际化和语言标记**

✅ **Hreflang 标签**

- 在 layout.tsx 中添加了 hreflang 链接
- 帮助搜索引擎理解多语言内容关系
- 支持 `en`, `zh`, `zh-CN` 和 `x-default`

✅ **Canonical URL**

- 为每个页面设置 canonical 链接
- 防止重复内容问题

### 4. **结构化数据 (Schema.org)**

✅ **多个 Schema 类型**

- `Organization`: 网站组织信息
- `WebApplication`: 应用的详细信息，标记为金融应用
- `FAQPage`: 常见问题解答，提升知识面板展示概率

✅ **本地化 Schema**

- Schema 内容根据语言自动调整
- 中文版本包含中文描述和常见问题

### 5. **性能和技术 SEO**

✅ **DNS 预解析和预连接**

```html
<link rel="preconnect" href="https://pagead2.googlesyndication.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

✅ **Google Analytics**

- 已配置 GA4 跟踪脚本
- 替换 `G-XXXXXXXXXX` 为实际的 GA4 ID

✅ **响应式设计**

- 正确的 viewport meta 标签
- 支持所有设备的 SEO

## 待办项（下一步优化）

### 短期优化

1. **Google Search Console**
   - 验证网站所有权
   - 提交 sitemap
   - 查看搜索流量和排名数据
   - 修复爬虫错误

2. **Baidu Search Console** (必需，用于中文搜索)
   - 验证网站所有权
   - 提交 sitemap
   - 配置 robots.txt
   - 监控"积蓄模拟器"等关键词的排名

3. **Google Analytics ID**
   - 替换 `G-XXXXXXXXXX` 为实际的 GA4 ID

4. **OG 图像**
   - 为 og:image 准备一个高质量的预览图 (1200x630px)
   - 上传到项目中并更新元数据

### 中期优化

1. **内容优化**
   - 创建详细的功能说明页面
   - 编写 FAQ 博客文章
   - 优化页面的主要内容关键词密度
   - 添加更多中文内容（如财务规划指南）

2. **反向链接建设**
   - 在财务博客、论坛提及项目
   - 向相关网站提交
   - 创建可分享的内容

3. **社交信号**
   - 优化 Twitter/X 卡片
   - 添加社交分享按钮
   - 鼓励用户分享

### 长期优化

1. **关键词研究和监控**
   - 使用 Google Search Console 监控排名
   - 追踪"积蓄模拟器"等关键词
   - 定期更新内容以保持排名

2. **移动端优化**
   - 确保 Core Web Vitals 评分优秀
   - 测试 Mobile-Friendly
   - 优化移动端交互

3. **信号和信任**
    - 构建域名权重
    - 获得优质反向链接
    - 建立品牌权威性

## 关键关键词

### 中文关键词

- 主要: **积蓄模拟器**
- 次要: 财务规划、储蓄计算器、财务自由、投资回报、理财工具、FIRE、财务独立

### 英文关键词

- 主要: **Savings Simulator**
- 次要: Financial Planning, Savings Calculator, Financial Freedom, Investment Returns, Wealth Growth, FIRE, Financial Independence

## 验证步骤

1. **检查 Sitemap**

   ```
   https://dragonnzhang.github.io/savings-simulator/sitemap.xml
   ```

2. **检查 robots.txt**

   ```
   https://dragonnzhang.github.io/savings-simulator/robots.txt
   ```

3. **验证元标签**
   - 使用 Chrome DevTools 检查 `<head>` 部分
   - 确认 hreflang, canonical, og: 标签正确

4. **测试结构化数据**
   - 使用 Google 结构化数据测试工具
   - 访问: <https://search.google.com/test/rich-results>

5. **Mobile Friendly 测试**
   - 使用 Google Mobile-Friendly Test
   - 访问: <https://search.google.com/test/mobile-friendly>

6. **核心网络指标**
   - 使用 Google PageSpeed Insights
   - 访问: <https://pagespeed.web.dev/>

## 资源链接

- [Google Search Console](https://search.google.com/search-console)
- [Baidu Search Console](https://ziyuan.baidu.com/)
- [Google Structured Data Testing Tool](https://search.google.com/test/rich-results)
- [Schema.org](https://schema.org/)

## 预期结果

通过以上 SEO 优化：

- ✅ Google 搜索"Savings Simulator"时能找到你的网站
- ✅ Baidu 搜索"积蓄模拟器"时能找到你的网站
- ✅ 搜索结果中显示正确的标题、描述和预览
- ✅ 提高搜索流量和转化率
- ✅ 改善用户体验和搜索排名

## 更新日期

- 2026-01-08: 初次 SEO 优化实施
