export default class AuthResponseDto {
  constructor(
    public token: string,
    public id: number,
    public name: string,
    public email: string,
    public avatar: string | null,
  ) {}
}
