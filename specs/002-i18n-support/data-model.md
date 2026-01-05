# Data Model: i18n

## Locale
The system supports two locales:
- `zh`: Chinese (Simplified) - Default
- `en`: English

## Translation Messages (`messages/*.json`)
Structured JSON mapping for UI components.

### Example Structure:
```json
{
  "Index": {
    "title": "积蓄模拟器",
    "subtitle": "Savings Simulator - 预测您的财务未来",
    "chartTitle": "积蓄增长趋势",
    "configTitle": "参数设置",
    "resultsTitle": "模拟结果",
    "finalSavings": "最终积蓄",
    "rowClickTip": "💡 点击任意行可调整该年参数"
  },
  "Form": {
    "income": "收入 Income",
    "annualIncome": "年收入 (Annual Income)",
    "annualGrowth": "年涨幅 (Annual Growth %)",
    "expenses": "支出 Expenses",
    "annualExpenses": "年支出 (Annual Expenses)",
    "investment": "投资 Investment",
    "annualReturn": "年化收益率 (Annual Return %)",
    "duration": "时长 Duration",
    "years": "模拟年数 (Years)"
  },
  "Table": {
    "year": "年份",
    "income": "收入",
    "expenses": "支出",
    "investmentReturn": "投资收益",
    "netSavings": "净储蓄",
    "totalSavings": "总积蓄",
    "yearLabel": "第 {year} 年",
    "overridden": "已调整",
    "emptyState": "请输入参数并点击「开始模拟」查看结果"
  },
  "Modal": {
    "title": "调整第 {year} 年参数",
    "income": "年收入 (Income)",
    "expenses": "年支出 (Expenses)",
    "cancel": "取消",
    "save": "保存"
  }
}
```

## User Preferences
Stored in `localStorage`:
- `key`: `NEXT_LOCALE`
- `values`: `'zh'`, `'en'`
