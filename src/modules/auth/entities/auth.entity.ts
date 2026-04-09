import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums';
import { Exclude } from 'class-transformer';

export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @ApiProperty({ description: 'User email' })
  email!: string;

  @Exclude() // This hides the password from the API response
  password!: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  role!: Role;

  @ApiProperty({ description: 'User creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'User update date' })
  updatedAt!: Date;

  // You can also include relations here
  // @ApiProperty({ type: () => BookingEntity, isArray: true })
  // bookings?: BookingEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
