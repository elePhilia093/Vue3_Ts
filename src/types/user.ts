export interface User {
  id: number;
  username: string;
  nickname: string;
  age: number;
  gender: string;
  email: string;
  password: string;
  phone: string;
  dept_id: number;
  create_time: string;
  update_time: string;
}

export type UserList = User[]