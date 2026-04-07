import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude() // This hides the password from the API response
  password: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // You can also include relations here
  // @ApiProperty({ type: () => BookingEntity, isArray: true })
  // bookings?: BookingEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}