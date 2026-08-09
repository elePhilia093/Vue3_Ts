export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  deptId: number | null;
  createTime: string;
  updateTime: string;
}

export interface PageResult<T> {
  records: T[]; // 数据列表
  total: number; // 总记录数
  size: number; // 每页条数
  current: number; // 当前页码
  pages: number; // 总页数
}

export type UserPageResult = PageResult<User>;

export interface UpdateUserRequest {
  id: number | undefined;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number | string;
}
