import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './models/items.schema';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { HashService } from './services/hash/hash.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client/dist'),
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        };
      }, // Usa la función useFactory para proporcionar la configuración dinámicamente desde el archivo jwt.config.ts
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, HashService],
})
export class AppModule {}
