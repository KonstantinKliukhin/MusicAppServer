import { User } from '../../user/schemas/user.schema';
import UserResponseDto from '../../user/dto/user-response.dto';

export default function userToResponse(user: User): UserResponseDto {
  return new UserResponseDto(user.id, user.name, user.email);
}
