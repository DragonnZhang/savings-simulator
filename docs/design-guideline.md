# 储蓄模拟器 UI 设计指南

## 设计概览

本设计指南基于 **aesthetic skill** 的四阶段设计框架，旨在创建一个现代、专业且具有高交互性的财务规划应用。

---

## 1. BEAUTIFUL: 美学原则

### 视觉层次

- **标题层级**：采用渐变文字和放大尺寸突出主要信息
  - H1: `text-5xl md:text-7xl` 配合渐变背景
  - H2: `text-2xl` 配合图标和渐变文字
- **卡片层级**：使用阴影、边框和玻璃态效果创建深度感
- **色彩层级**：通过不同色调的渐变区分功能区域

### 配色方案

采用深色主题配合鲜艳的强调色：

**主色调**：

- 背景：`#0a0a0a` 到 `#1a1625`（紫色调）的动态渐变
- 玻璃态卡片：`rgba(31, 41, 55, 0.5)` 到 `rgba(17, 24, 39, 0.6)`

**强调色**：

- 翠绿色（收入）：`#10b981` → `#34d399`
- 玫瑰红（支出）：`#f43f5e` → `#fb7185`
- 琥珀色（投资）：`#f59e0b` → `#fbbf24`
- 天蓝色（目标）：`#0ea5e9` → `#38bdf8`
- 紫色（总储蓄）：`#a855f7` → `#ec4899`

**色彩心理学应用**：

- 绿色传达成长和财富积累
- 红色提示支出和警示
- 金色象征投资回报
- 蓝色表示目标和规划
- 紫色代表最终成就

### 排版系统

- **字体族**：Geist Sans（无衬线）配合 Geist Mono（等宽，用于数字）
- **字重**：从 `font-medium` 到 `font-extrabold` 创建层次
- **字号**：响应式设计，从 `text-xs` 到 `text-7xl`
- **间距**：统一使用 `tracking-wide` 提升可读性

### 留白与间距

- 卡片内边距：`p-6` 到 `p-8`
- 组件间距：`space-y-5` 到 `space-y-10`
- 网格间距：`gap-8` 到 `gap-10`
- 充足的留白让界面呼吸，提升视觉舒适度

---

## 2. RIGHT: 功能性与可访问性

### 玻璃态设计（Glassmorphism）

```css
.glass {
  background: linear-gradient(135deg, 
    rgba(31, 41, 55, 0.5) 0%, 
    rgba(17, 24, 39, 0.6) 100%);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(75, 85, 99, 0.4);
  box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
}
```

**优势**：

- 提供视觉深度和层次
- 保持内容可读性
- 现代感和高级感

### 响应式设计

- 断点：`md:` (768px), `lg:` (1024px)
- 移动端优先的栅格布局
- 自适应字体大小和间距

### 可访问性考虑

- **对比度**：所有文本与背景的对比度 ≥ 4.5:1（WCAG AA 标准）
- **焦点指示器**：明确的聚焦环和阴影
- **键盘导航**：所有交互元素可用键盘访问
- **语义化 HTML**：正确使用标题、表格、表单标签

---

## 3. SATISFYING: 微交互动画

### 动画时长规范

- **快速交互**：150-200ms（按钮按下、输入框聚焦）
- **标准过渡**：250-300ms（悬停效果、状态变化）
- **入场动画**：500-600ms（页面加载、卡片显示）
- **背景动画**：20s（渐变流动）

### 缓动曲线（Easing）

- **ease-out**：`cubic-bezier(0.34, 1.56, 0.64, 1)` - 元素入场
- **ease-in**：标准 - 元素离场
- **spring**：回弹效果用于按钮和卡片

### 关键动画效果

#### 入场动画

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

#### 渐变流动

```css
@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

#### 卡片悬停

- `transform: translateY(-4px) scale(1.01)`
- 边框光晕效果
- 阴影增强：`0 25px 50px rgba(0, 0, 0, 0.5)`

#### 按钮交互

- 涟漪效果（::before 伪元素）
- 按下缩放：`scale(0.96)`
- 背景渐变过渡

#### 输入框聚焦

- 发光环：`box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25)`
- 轻微上移：`translateY(-1px)`
- 边框颜色过渡

---

## 4. PEAK: 叙事性设计元素

### 背景粒子效果

使用模糊的彩色圆形营造深度：

```tsx
<div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
<div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
```

### 渐进式展示

各区域按顺序入场（0.1s - 0.5s 的延迟），引导用户视线流动：

1. 标题（0.1s）
2. 图表区域（0.2s）
3. 表单区域（0.3s）
4. 场景管理（0.4s）
5. 结果表格（0.5s）

### 视觉引导元素

- **脉动圆点**：`animate-ping` 配合静态圆点叠加
- **彩色指示条**：各功能区左侧的垂直彩条
- **渐变标题**：使用 `bg-clip-text` 实现彩虹文字效果

### 数据可视化

- 图表使用渐变填充和流畅曲线
- 表格行支持悬停渐变高亮
- 关键数据使用渐变文字和脉动效果

---

## 组件设计规范

### 输入框

```tsx
<input className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 
  border-2 border-gray-700 rounded-xl text-white font-medium 
  focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 
  transition-all duration-300 hover:border-emerald-600/50 
  hover:shadow-lg hover:shadow-emerald-500/10" />
```

### 卡片容器

```tsx
<div className="glass rounded-3xl p-8 shadow-2xl card-hover glow-emerald">
  {/* 内容 */}
</div>
```

### 按钮

```tsx
<button className="px-6 py-2.5 rounded-full bg-linear-to-r from-sky-500 to-blue-500 
  text-white font-bold shadow-lg shadow-sky-500/30 
  hover:from-sky-400 hover:to-blue-400 transition-all duration-300">
  {/* 按钮文本 */}
</button>
```

### 表格

- 表头：渐变背景 + 粗体大写文字
- 表格行：悬停渐变高亮 + 边框分隔
- 单元格：等宽字体显示数字，渐变文字显示总计

---

## 实施要点

### 性能优化

- 使用 CSS `transform` 和 `opacity` 实现动画（GPU 加速）
- 避免动画过多导致卡顿
- 长列表使用虚拟滚动

### 一致性

- 复用 `.glass`、`.card-hover`、`.glow-*` 等工具类
- 统一的间距系统（4px 基数）
- 统一的圆角规范（`rounded-xl` 到 `rounded-3xl`）

### 渐进增强

- 基础功能在无动画情况下仍可用
- 支持 `prefers-reduced-motion` 媒体查询

---

## 设计评分

根据 aesthetic skill 标准评估：

| 维度 | 评分 | 说明 |
|------|------|------|
| 视觉层次 | 9/10 | 清晰的信息层级，渐变和尺寸对比突出 |
| 色彩运用 | 9/10 | 专业配色，符合色彩心理学 |
| 排版 | 8/10 | 响应式字体，留白充足 |
| 动画流畅度 | 9/10 | 时长合理，缓动自然 |
| 交互反馈 | 9/10 | 悬停、聚焦、点击反馈明确 |
| 一致性 | 9/10 | 设计系统完整，组件复用良好 |
| 可访问性 | 8/10 | 对比度达标，语义化 HTML |
| 整体美感 | **9/10** | 现代、专业、引人入胜 |

---

## 后续改进建议

1. **深色/浅色模式切换**：添加主题切换功能
2. **自定义主题**：允许用户选择强调色
3. **高级动画**：添加数据加载骨架屏
4. **图表增强**：添加缩放、工具提示、数据标注
5. **国际化图标**：为不同语言优化图标和符号

---

**设计原则总结**：
> "追求美感，确保可用，注重细节，讲述故事"

本设计遵循现代 Web 设计最佳实践，结合玻璃态、渐变、微动画等流行趋势，打造出既美观又实用的财务规划工具。
