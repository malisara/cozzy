export default class User {
  constructor(
    public name: string,
    public lastName: string,
    public city: string,
    public street: string,
    public number: number,
    public zip: number,
    public email: string,
    public phone: number,
    public username: string,
    public password: string,
    public id?: number | null,
    public passwordConfirm?: string
  ) {}
}
