import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from 'express';

const config = new DocumentBuilder()
  .setTitle('Screen Manager')
  .setDescription('REST API used by the Screen Manager app to manage screens')
  .setVersion('1.0')
  .addBearerAuth()
  .addSecurityRequirements('bearer')
  .build();

const initializeSwagger = (app: INestApplication<any>) => {
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    useGlobalPrefix: true,
    jsonDocumentUrl: '/openapi.json',
    yamlDocumentUrl: '/openapi.yaml',
  });
};

export default initializeSwagger;
