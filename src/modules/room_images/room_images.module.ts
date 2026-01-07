import { Module } from '@nestjs/common';
import { RoomImagesService } from './room_images.service';
import { RoomImagesController } from './room_images.controller';

@Module({
  controllers: [RoomImagesController],
  providers: [RoomImagesService],
})
export class RoomImagesModule {}
