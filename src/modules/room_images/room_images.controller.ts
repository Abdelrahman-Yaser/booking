import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomImagesService } from './room_images.service';
import { CreateRoomImageDto } from './dto/create-room_image.dto';
import { UpdateRoomImageDto } from './dto/update-room_image.dto';

@Controller('room-images')
export class RoomImagesController {
  constructor(private readonly roomImagesService: RoomImagesService) {}

  @Post()
  create(@Body() createRoomImageDto: CreateRoomImageDto) {
    return this.roomImagesService.create(createRoomImageDto);
  }

  @Get()
  findAll() {
    return this.roomImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomImageDto: UpdateRoomImageDto) {
    return this.roomImagesService.update(+id, updateRoomImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomImagesService.remove(+id);
  }
}
