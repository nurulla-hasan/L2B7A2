import type { TRole } from "../../types/users.type"

export type TSignUpUser = {
  name: string,
  email: string,
  password: string,
  role?: TRole
}


export type TLoginUser = {
  email: string,
  password: string
}