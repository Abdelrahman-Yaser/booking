// // src/modules/rooms/rooms.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service'; // تأكد من المسار
// import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto'; // تأكد من وجوده

// @Injectable()
// export class RoomsService {
//   delete(id: string) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(private prisma: PrismaService) {}

//   async create(dto: CreateRoomDto) {
//     return await this.prisma.room.create({
//       data: {
//         number: dto.number,
//         type: dto.type,
//         pricePerNight: dto.pricePerNight,
//         capacity: dto.capacity,
//         status: dto.status,
//         // الربط مع الـ Tenant يتم عبر الـ ID
//         tenant: {
//           connect: { id: dto.tenantId } 
//         }
//       },
//       include: {
//         tenant: true, // اختياري: إذا أردت إرجاع بيانات الـ tenant فور الإنشاء
//       }
//     });
//   }

//   async findAll() {
//     return this.prisma.room.findMany({
//       include: {
//         tenant: {
//           select: {
//             id: true,
//             name: true, // يفضل اختيار حقول معينة بدلاً من true لجلب كل شيء
//           }
//         },
//       },
//       orderBy: {
//         createdAt: 'desc', // ترتيب الغرف من الأحدث للأقدم
//       }
//     });
//   }

//   async findOne(id: string) {
//     const room = await this.prisma.room.findUnique({
//       where: { id },
//       include: {
//         tenant: true,
//       },
//     });

//     if (!room) {
//       throw new NotFoundException(`Room with ID ${id} not found`);
//     }

//     return room;
//   }

//   async update(id: string, dto: UpdateRoomDto) {
//     // التأكد من وجود الغرفة أولاً
//     await this.findOne(id);

//     return this.prisma.room.update({
//       where: { id },
//       data: dto,
//     });
//   }

//   async remove(id: string) {
//     await this.findOne(id);
//     return this.prisma.room.delete({
//       where: { id },
//     });
//   }
// }