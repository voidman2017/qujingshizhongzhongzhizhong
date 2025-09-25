import { describe, it, expect, beforeEach } from 'vitest';

// 测试用的类型和类定义
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
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

  clear(): void {
    this.users = [];
  }
}

function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

type Status = 'pending' | 'completed' | 'cancelled';

interface Task {
  id: number;
  title: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
}

describe('TypeScript 基础功能测试', () => {
  let userManager: UserManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  describe('用户管理', () => {
    it('应该能够添加用户', () => {
      const user: User = {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        age: 25
      };

      userManager.addUser(user);
      expect(userManager.getUserCount()).toBe(1);
    });

    it('应该能够获取用户', () => {
      const user: User = {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com'
      };

      userManager.addUser(user);
      const foundUser = userManager.getUser(1);
      
      expect(foundUser).toEqual(user);
    });

    it('应该返回所有用户', () => {
      const user1: User = { id: 1, name: '张三', email: 'zhangsan@example.com' };
      const user2: User = { id: 2, name: '李四', email: 'lisi@example.com' };

      userManager.addUser(user1);
      userManager.addUser(user2);

      const allUsers = userManager.getAllUsers();
      expect(allUsers).toHaveLength(2);
      expect(allUsers).toContain(user1);
      expect(allUsers).toContain(user2);
    });

    it('找不到用户时应该返回 undefined', () => {
      const foundUser = userManager.getUser(999);
      expect(foundUser).toBeUndefined();
    });
  });

  describe('泛型函数', () => {
    it('应该创建数字数组', () => {
      const numbers = createArray(3, 42);
      expect(numbers).toEqual([42, 42, 42]);
      expect(numbers).toHaveLength(3);
    });

    it('应该创建字符串数组', () => {
      const strings = createArray(2, 'hello');
      expect(strings).toEqual(['hello', 'hello']);
      expect(strings).toHaveLength(2);
    });

    it('应该创建空数组', () => {
      const empty = createArray(0, 'test');
      expect(empty).toEqual([]);
      expect(empty).toHaveLength(0);
    });
  });

  describe('类型系统', () => {
    it('应该正确处理联合类型', () => {
      const task: Task = {
        id: 1,
        title: '测试任务',
        status: 'pending',
        priority: 'high'
      };

      expect(task.status).toBe('pending');
      expect(['pending', 'completed', 'cancelled']).toContain(task.status);
    });

    it('应该正确处理可选属性', () => {
      const userWithAge: User = {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        age: 25
      };

      const userWithoutAge: User = {
        id: 2,
        name: '李四',
        email: 'lisi@example.com'
      };

      expect(userWithAge.age).toBe(25);
      expect(userWithoutAge.age).toBeUndefined();
    });

    it('应该正确处理实用类型', () => {
      const task: Task = {
        id: 1,
        title: '原始任务',
        status: 'pending',
        priority: 'medium'
      };

      // Partial<Task> - 所有属性都是可选的
      const partialUpdate: Partial<Task> = {
        title: '更新的标题',
        status: 'completed'
      };

      // Pick<Task, 'title'> - 只选择 title 属性
      const titleOnly: Pick<Task, 'title'> = {
        title: '只有标题'
      };

      // Omit<Task, 'id'> - 排除 id 属性
      const taskWithoutId: Omit<Task, 'id'> = {
        title: '无 ID 任务',
        status: 'pending',
        priority: 'low'
      };

      expect(partialUpdate.title).toBe('更新的标题');
      expect(titleOnly.title).toBe('只有标题');
      expect(taskWithoutId.title).toBe('无 ID 任务');
      expect('id' in taskWithoutId).toBe(false);
    });
  });
});