# TypeScript 学习项目

一个简单的 TypeScript 学习示例，包含基础概念演示和测试用例。

## 📚 项目概述

这个项目提供了一个简洁的 TypeScript 学习示例，涵盖了核心概念：

- **基础类型**：string, number, boolean
- **接口**：定义对象结构
- **类**：面向对象编程
- **泛型**：类型参数化
- **联合类型**：多种类型选择
- **实用类型**：Partial, Pick, Omit 等

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 运行示例

```bash
# 运行主示例
npm run dev

# 或直接运行 demo
npm run demo
```

### 运行测试

```bash
# 运行测试
npm test

# 监听模式运行测试
npm run test:watch

# 运行一次测试
npm run test:run
```

## 🏗️ 项目结构

```
typescript-learning/
├── src/
│   ├── demo              # 主要示例代码
│   ├── test              # 测试用例
│   └── index.ts          # 入口文件
├── .eslintrc.json        # ESLint 配置
├── .prettierrc           # Prettier 配置
├── tsconfig.json         # TypeScript 配置
├── vitest.config.ts      # Vitest 测试配置
└── package.json          # 项目配置
```

## 📖 学习内容

### 1. 基础类型

```typescript
const message: string = 'Hello TypeScript!';
const count: number = 42;
const isActive: boolean = true;
```

### 2. 接口定义

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
}
```

### 3. 类

```typescript
class UserManager {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
```

### 4. 泛型

```typescript
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
```

### 5. 联合类型

```typescript
type Status = 'pending' | 'completed' | 'cancelled';
```

### 6. 实用类型

```typescript
type PartialTask = Partial<Task>;      // 所有属性可选
type TaskTitle = Pick<Task, 'title'>;  // 只选择 title
type TaskWithoutId = Omit<Task, 'id'>; // 排除 id
```

## 🛠️ 开发工具

### 代码质量

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format
```

### 构建

```bash
# 构建项目
npm run build

# 清理构建文件
npm run clean

# 运行构建后的代码
npm start
```

## 📝 学习建议

1. **查看代码**：阅读 `src/demo.ts` 中的示例代码
2. **运行示例**：使用 `npm run demo` 查看输出
3. **查看测试**：阅读 `src/demo.test.ts` 了解如何测试 TypeScript 代码
4. **运行测试**：使用 `npm test` 验证代码正确性
5. **修改实验**：尝试修改代码，观察类型检查和测试结果

## 🎯 学习目标

完成这个项目后，你将能够：

- ✅ 理解 TypeScript 基础类型系统
- ✅ 使用接口定义对象结构
- ✅ 编写类型安全的类和方法
- ✅ 使用泛型创建可复用的代码
- ✅ 应用联合类型和实用类型
- ✅ 编写和运行 TypeScript 测试

## 🔧 配置说明

### TypeScript 配置 (`tsconfig.json`)

- 目标版本：ES2022
- 模块系统：ESNext
- 严格模式：启用

### ESLint 配置 (`.eslintrc.json`)

- TypeScript 推荐规则
- 禁用 `any` 类型

### Prettier 配置 (`.prettierrc`)

- 单引号，分号，尾随逗号
- 打印宽度：100 字符

## 🔗 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest 文档](https://vitest.dev/)

---

**开始你的 TypeScript 学习之旅吧！** 🚀
