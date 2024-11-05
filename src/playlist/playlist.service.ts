import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    return this.prismaService.playlist.create({
      data: {
        name: createPlaylistDto.name,
      },
    });
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }

  async createFile(
    file: Express.Multer.File,
    playlistId: number,
    userId: number,
  ) {
    const result = await this.prismaService.media.create({
      data: {
        path: file.filename,
        duration: 0,
        name: file.filename,
        type: file.mimetype,
        owner: {
          connect: {
            id: userId,
          },
        },
        playlist: {
          connect: {
            id: playlistId,
          },
        },
      },
    });
    return file;
  }
}
