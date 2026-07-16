import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomImageDto } from './create-room_image.dto';

export class UpdateRoomImageDto extends PartialType(CreateRoomImageDto) {}
