// import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseInterceptors, UseGuards} from '@nestjs/common';
// import { CreateUserDto } from './dtos/create-user.dto';
// import { UsersService } from './users.service';
// import { UpdateUserDto } from './dtos/update-user.dto';
// import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
// import { UserDto } from './dtos/user.dto';
// import { AuthService } from './auth.service';
// import { CurrentUser } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
// import { AuthGuard } from 'src/guards/auth.guard';

// @Controller('auth')
// @Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
// export class UsersController {
//     constructor(
//         private authService: AuthService,
//         private userService: UsersService) {}

//     // @Get('/whoAmi')
//     // whoAmi(@Session() session: any) {
//     //     return this.userService.findOne(session.userId);
//     // }

//     @Get('/whoAmI')
//     @UseGuards(AuthGuard) // If the user is not signed in they will not be able to access this route handler.
//     whoAmI(@CurrentUser() user: string) {
//         return user;
//     }

//     @Post('signout')
//     singout(@Session() session: any) {
//         session.userId = null;
//     }

//     @Post('signup')
//     async createUser(@Body() body: CreateUserDto, @Session() session: any) {
//         const user =  await this.authService.signup(body.email, body.password);
//         session.userId = user.id
//         return user;
//     }

//     @Post('/signin')
//     async signin(@Body() body: CreateUserDto, @Session() session: any) {
//         const user = await this.authService.signin(body.email, body.password);
//         session.userId = user.id 
//         return user
//     }

//     // @UseInterceptors(new SerializeInterceptor(UserDto))
//     // @Serialize(UserDto)
//     @Get('/:id')
//     async findUser(@Param('id') id: string) {
//         console.log('Handler is running');
//         const user =  await this.userService.findOne(parseInt(id));
//         if(!user) {
//             throw new NotFoundException('user not found');
//         }
//         return user;
//     }

//     @Get()
//     findAllUsers(@Query('email') email: string) {
//         return this.userService.find(email);
//     }

//     @Delete('/:id')
//     removeUsers(@Param('id') id: string) {
//         this.userService.remove(parseInt(id));
//     }

//     @Patch('/:id')
//     UpdateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
//         return this.userService.update(parseInt(id), body);
//     }

// }

import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards,
  } from '@nestjs/common';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { UpdateUserDto } from './dtos/update-user.dto';
  import { UsersService } from './users.service';
  import { Serialize } from '../interceptors/serialize.interceptor';
  import { UserDto } from './dtos/user.dto';
  import { AuthService } from './auth.service';
  import { CurrentUser } from './decorators/current-user.decorator';
  import { User } from './user.entity';
  import { AuthGuard } from '../guards/auth.guard';
  
  @Controller('auth')
  @Serialize(UserDto)
  export class UsersController {
    constructor(
      private usersService: UsersService,
      private authService: AuthService,
    ) {}
  
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
      return user;
    }
  
    @Post('/signout')
    signOut(@Session() session: any) {
      session.userId = null;
    }
  
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signup(body.email, body.password);
      session.userId = user.id;
      return user;
    }
  
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signin(body.email, body.password);
      session.userId = user.id;
      return user;
    }
  
    @Get('/:id')
    async findUser(@Param('id') id: string) {
      const user = await this.usersService.findOne(parseInt(id));
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    }
  
    @Get()
    findAllUsers(@Query('email') email: string) {
      return this.usersService.find(email);
    }
  
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
      return this.usersService.remove(parseInt(id));
    }
  
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
      return this.usersService.update(parseInt(id), body);
    }
  }
  