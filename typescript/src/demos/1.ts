/**
 * TypeScript 基础示例
 * 演示 TypeScript 的核心特性
 */

// 1. 基础类型
const message: string = 'Hello TypeScript!';
const count: number = 42;
const isActive: boolean = true;

// 2. 接口定义
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
}

// 3. 类定义
class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(`用户 ${user.name} 已添加`);
  }

  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserCount(): number {
    return this.users.length;
  }
}

// 4. 泛型函数
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// 5. 联合类型和字面量类型
type Status = 'pending' | 'completed' | 'cancelled';

interface Task {
  id: number;
  title: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
}

// 6. 实用类型
type PartialTask = Partial<Task>;
type TaskTitle = Pick<Task, 'title'>;
// type TaskWithoutId = Omit<Task, 'id'>;

// 7. 示例使用
export function runDemo(): void {
  console.log('=== TypeScript 基础示例 ===\n');

  // 基础类型使用
  console.log('1. 基础类型:');
  console.log(`消息: ${message}`);
  console.log(`计数: ${count}`);
  console.log(`状态: ${isActive}\n`);

  // 用户管理示例
  console.log('2. 用户管理:');
  const userManager = new UserManager();
  
  const user1: User = {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25
  };

  const user2: User = {
    id: 2,
    name: '李四',
    email: 'lisi@example.com'
  };

  userManager.addUser(user1);
  userManager.addUser(user2);

  console.log(`总用户数: ${userManager.getUserCount()}`);
  console.log('所有用户:', userManager.getAllUsers());

  const foundUser = userManager.getUser(1);
  console.log('查找用户 ID 1:', foundUser);

  // 泛型函数使用
  console.log('\n3. 泛型函数:');
  const numbers = createArray(3, 0);
  const strings = createArray(2, 'hello');
  console.log('数字数组:', numbers);
  console.log('字符串数组:', strings);

  // 任务示例
  console.log('\n4. 任务管理:');
  const task: Task = {
    id: 1,
    title: '学习 TypeScript',
    status: 'pending',
    priority: 'high'
  };

  console.log('任务:', task);

  // 实用类型示例
  const partialTask: PartialTask = {
    title: '更新任务标题'
  };

  const taskTitle: TaskTitle = {
    title: '只有标题的任务'
  };

  console.log('部分任务更新:', partialTask);
  console.log('任务标题:', taskTitle);

  console.log('\n=== 示例完成 ===');
}
