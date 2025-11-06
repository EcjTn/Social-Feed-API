import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity'
import { UsersController } from './users.controller';
import { Posts } from 'src/posts/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Posts])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
