This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 开发规范

### 主题色优化规则

**所有页面都必须使用骨架屏**，为了优化主题色闪烁的问题。

#### 背景
由于 Next.js 的 SSR（服务端渲染）架构限制：
- 服务端无法访问 `localStorage`，只能使用默认主题色
- 客户端水合后才能从 `localStorage` 读取用户自定义的主题色
- 这会导致页面刷新时出现主题色从默认值切换到自定义值的闪烁现象

#### 解决方案
1. **CSS 过渡效果**：在 `app/globals.css` 中添加全局过渡效果，让颜色变化更平滑
2. **骨架屏加载**：在主题色加载完成前显示骨架屏，避免用户看到颜色变化
   - 在 layout 组件中使用 `isClient` 状态标记
   - 水合完成前返回 `<LoadingSkeleton />` 组件
   - 水合完成后才渲染实际内容

#### 实现示例
```typescript
// app/dashboard/layout.tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
  const savedColor = localStorage.getItem('theme-color');
  if (savedColor) {
    setPrimaryColor(savedColor);
  }
}, []);

// 在主题色加载完成前显示骨架屏
if (!isClient) {
  return <LoadingSkeleton />;
}
```

#### 相关文件
- 骨架屏组件：`app/dashboard/loading.tsx`
- 全局样式：`app/globals.css`
- Layout 组件：`app/dashboard/layout.tsx`
