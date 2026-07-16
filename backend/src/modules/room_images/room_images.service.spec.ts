import { Test, TestingModule } from '@nestjs/testing';
import { RoomImagesService } from './room_images.service';

describe('RoomImagesService', () => {
  let service: RoomImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomImagesService],
    }).compile();

    service = module.get<RoomImagesService>(RoomImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
