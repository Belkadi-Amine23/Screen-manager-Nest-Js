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
  Request,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/upload-file.dto';
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    example: {
      id: 1,
      name: 'My playlist',
    },
  })
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
  @ApiHeader({
    name: 'content-language',
    required: false,
  })
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
          const filename = `${new Date().toLocaleString(req.headers['content-language'] || 'fr-FR').replaceAll('/', '-')}-${file.originalname}`;
          callback(null, filename);
        },
        destination: './uploads',
      }),
    }),
  )
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Media file to upload',
    type: FileUploadDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadDto,
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    return this.playlistService.createFile(file, body.playlistId, req.user.sub);
  }
}
