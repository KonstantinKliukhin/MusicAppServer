import { User } from '../../schemas/user.schema';
import UserResponseDto from '../../dto/user-response.dto';

export default function userToResponse(user: User): UserResponseDto {
  return new UserResponseDto(user.id, user.name, user.email);
}
