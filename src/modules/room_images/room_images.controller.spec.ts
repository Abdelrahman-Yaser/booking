import { Test, TestingModule } from '@nestjs/testing';
import { RoomImagesController } from './room_images.controller';
import { RoomImagesService } from './room_images.service';

describe('RoomImagesController', () => {
  let controller: RoomImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomImagesController],
      providers: [RoomImagesService],
    }).compile();

    controller = module.get<RoomImagesController>(RoomImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
