// rooms.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
  ) {}

  create(dto: CreateRoomDto) {
    const room = this.roomsRepo.create(dto);
    return this.roomsRepo.save(room);
  }

  findAll() {
    return this.roomsRepo.find({ relations: ['tenant'] });
  }

  findOne(id: string) {
    return this.roomsRepo.findOne({ where: { id }, relations: ['tenant'] });
  }
}