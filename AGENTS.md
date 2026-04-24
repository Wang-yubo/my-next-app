<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:user-custom-rules -->
# 用户自定义交互规则

## 对话确认流程
每次对话都需要遵循以下流程:

1. **需求复述**: 在开始任何工作前,必须先向我复述一遍您理解的需求,确保我们达成共识
2. **疑问澄清**: 如果对需求有任何疑问、不确定之处,或者有更好的实现建议,必须主动向我提问
3. **等待确认**: 待我明确确认后,才能开始修改代码或执行操作
4. **分步执行**: 对于复杂任务,应该分步骤进行,每完成一步都要向我汇报进度并确认下一步计划

## 重要原则
- 不要假设我的意图,有疑问就问
- 提供多个方案时,说明各自的优缺点,让我做选择
- 修改代码前,先说明将要做什么改动以及为什么
- 如果发现潜在问题或风险,及时提醒我
<!-- END:user-custom-rules -->
