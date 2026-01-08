import { FC } from 'react';

interface StructuredDataProps {
  locale: string;
}

export const StructuredData: FC<StructuredDataProps> = ({ locale }) => {
  const isZh = locale === 'zh';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: isZh ? '积蓄模拟器' : 'Savings Simulator',
    url: 'https://savings.abrdns.com',
    logo: 'https://savings.abrdns.com/vercel.svg',
    sameAs: [
      'https://github.com/DragonnZhang/savings-simulator',
    ],
  };

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isZh ? '积蓄模拟器 - 财务规划工具' : 'Savings Simulator - Financial Planning Tool',
    description: isZh 
      ? '通过交互式模拟器规划您的财务未来。可视化储蓄增长，支持年度调整和多场景对比。'
      : 'Plan your financial future with our interactive savings simulator. Visualize savings growth with customizable parameters and scenario comparisons.',
    url: `https://savings.abrdns.com/${locale}`,
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'DragonnZhang',
      url: 'https://github.com/DragonnZhang',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isZh ? '什么是积蓄模拟器？' : 'What is Savings Simulator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isZh 
            ? '积蓄模拟器是一个交互式财务规划工具，帮助用户可视化他们的储蓄增长。您可以输入初始储蓄、月度储蓄、年回报率等参数，模拟器会计算出指定年限内的总储蓄。'
            : 'Savings Simulator is an interactive financial planning tool that helps users visualize their savings growth. You can input your initial savings, monthly savings rate, annual returns, and other parameters to see how your wealth grows over time.',
        },
      },
      {
        '@type': 'Question',
        name: isZh ? '我的数据是否安全？' : 'Is my data safe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isZh 
            ? '是的。所有计算完全在您的浏览器中进行，我们不会收集或存储任何个人财务数据。'
            : 'Yes. All calculations are performed locally in your browser. We do not collect or store any personal financial information.',
        },
      },
      {
        '@type': 'Question',
        name: isZh ? '我可以保存多个场景吗？' : 'Can I save multiple scenarios?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isZh 
            ? '可以。您可以保存和比较多个财务规划场景，帮助您做出最佳决策。'
            : 'Yes. You can save and compare multiple financial planning scenarios to help you make the best decisions.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};
