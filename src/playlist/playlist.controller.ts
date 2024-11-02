import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/user/public.decorator';
import { writeFileSync } from 'fs';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mov|pdf)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        filename(req, file, callback) {
          const filename = `${new Date().toLocaleString('fr-FR').replaceAll('/', '-')}-${file.originalname}`;
          callback(null, filename);
        },
        destination: './uploads',
      }),
    }),
  )
  @HttpCode(201)
  @Public()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.prismaService.media.create({
      data: {
        path: file.filename,
        duration: 0,
        name: file.filename,
        type: file.mimetype,
        owner: {
          connectOrCreate: {
            where: { email: 'test@gmail.com' },
            create: {
              email: 'test@gmail.com',
              password: '1234',
            },
          },
        },
        playlist: {
          connectOrCreate: {
            where: { id: 1 },
            create: {
              name: 'test',
            },
          },
        },
      },
    });
    return file;
  }
}
