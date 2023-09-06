import { data } from "autoprefixer";

export default class User {
  constructor(
    public name: string,
    public lastName: string,
    public city: string,
    public street: string,
    public number: string,
    public zip: number,
    public email: string,
    public phone: string,
    public username: string,
    public password: string,
    public id?: number | null,
    public passwordConfirm?: string
  ) {}
}
