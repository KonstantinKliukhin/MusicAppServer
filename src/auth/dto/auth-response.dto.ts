export default class AuthResponseDto {
  constructor(
    public token: string,
    public id: number,
    public email: string,
    public avatar: string | null,
  ) {}
}
