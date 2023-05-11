export interface IUser {
  nickname: string,
  email: string,
  role: string,
  currentExperience: number,
  experienceNextLevel: number,
  level: number,
  coins: number,
  avatar: string,
  createdAt: string
}

export interface IToken {
  token: string
}

export type IUserRequest = FormData | IUserLogin;

interface IUserReg {
  nickname: string,
  email: string,
  password: string,
  avatar: File
}

interface IUserLogin {
  email: string,
  password: string
}