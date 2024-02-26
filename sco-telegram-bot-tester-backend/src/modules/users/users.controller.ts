import { httpErrorMessages } from '../../constants/http-error-messages.constants';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerService } from '../shared/services/controller.service';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/iuser.interface';
import { UsersService } from './users.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { websocketEvents } from '../websocket/constants/websocket.events';
import { usersConstants } from './constants/user.constants';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptService } from '../shared/services/bcrypt.service';
import { RoleConstants } from './constants/roles.constants';

@Controller('api/v1/users')
@ApiTags('Usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly controllerService: ControllerService,
    private readonly websocketsService: WebsocketGateway,
    private readonly bcryptService: BcryptService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch users, authguard required`,
    description: 'Devuelve los usuarios, se puede filtrar por parámetros QUERY. Necesaria autorización',
  })
  @ApiQuery({
    description: 'Devuelve los usuarios filtrados por una query, si no hay query, devuelve todos',
    type: String,
    required: false,
    name: 'query',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios devueltos correctamente',
  })
  async fetchUsers(@Res() res: Response, @Query() query?: any): Promise<Response<IUser[], Record<string, IUser[]>>> {
    const filter = query && query.query ? await this.controllerService.getParamsFromSwaggerQuery(query.query) : query;
    const users: IUser[] = await this.usersService.fetchUsers(filter);
    return res.status(200).json(users);
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Add user, authguard required`,
    description: 'Añade un nuevo usuario a la aplicación. Necesaria autorización',
  })
  @ApiBody({
    description: 'Ejemplo de creación de usuario utilizando la clase UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          password: usersConstants.PUBLIC.PASSWORD,
          email: usersConstants.PUBLIC.EMAIL,
          active: usersConstants.PUBLIC.ACTIVE,
          role: usersConstants.PUBLIC.ROLE,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario añadido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Nombre usuario ya existente',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado anteriormente',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuario administrador ya registrado',
  })
  async addUser(@Res() res: Response, @Body() user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
    const existUserName: IUser = await this.usersService.findUserByName(user.name);
    if (existUserName) {
      console.error('[addUser] User already exist');
      throw new HttpException(httpErrorMessages.USERS.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const existUserEmail: IUser = await this.usersService.findUserByEmail(user.email);
    if (existUserEmail) {
      console.log('[addUser] Email already registered');
      throw new HttpException(httpErrorMessages.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const existRole: string = Object.values(RoleConstants).find(r => r == user.role);
    if (!existRole) {
      console.log('[addUser] Role not found');
      throw new HttpException(httpErrorMessages.USERS.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
    } 
    
    if (existRole == RoleConstants.ADMIN) {
      const existAdminUser: IUser = await this.usersService.findUserByRole(RoleConstants.ADMIN);
      if (existAdminUser) {
        console.log(`[addUser] User with role '${RoleConstants.ADMIN}' already exist`);
        throw new HttpException(httpErrorMessages.USERS.ADMIN_ALREADY_EXIST, HttpStatus.CONFLICT);
      }
    }

    try {
      const createdUser: IUser = await this.usersService.addUser(user);
      if (createdUser) {
        await this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
        return res.status(201).json(createdUser);
      }
    } catch (error) {
      throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      return undefined;
    }
  }

  @Put('/:name')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Update user, authguard required`,
    description: 'Actualiza un usuario existente de la aplicación. Necesaria autorización',
  })
  @ApiParam({
    description: 'Nombre del usuario para actualizar',
    type: String,
    required: false,
    name: 'name',
  })
  @ApiBody({
    description: 'Ejemplo de actialización de usuario utilizando la clase UpdateUserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          password: usersConstants.PUBLIC.PASSWORD,
          newPassword: 'newPassword',
          email: usersConstants.PUBLIC.EMAIL,
          active: usersConstants.PUBLIC.ACTIVE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Nombre usuario no encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado anteriormente',
  })
  async updateUser(@Res() res: Response, @Param('name') name: string, @Body() user: UpdateUserDto): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersService.findUserByName(name);
    if (!existUser) {
      console.log(`[updateUser] User not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.email != existUser.email) {
      const existNewEmail: IUser = await this.usersService.findUserByEmail(user.email);
      if (existNewEmail) {
        console.log('[updateUser] Email already registered');
        throw new HttpException(httpErrorMessages.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
      }
    }

    let updatePassword: boolean = false;
    if (user.password && user.newPassword) {
      // Compare Current User Password Provided
      const validPassword: boolean = await this.bcryptService.comparePasswords(user.password, existUser);
      if (validPassword) {
        // Encrypt User New Password Provided
        const encryptedNewPassword: string = await this.bcryptService.encryptPassword(user.newPassword);
        if (encryptedNewPassword) {
          // Assign New Password Encrypted To User Password Object To Update
          user.password = encryptedNewPassword;
          updatePassword = true;
        }
      }
    }

    try {
      const updatedUser: IUser = await this.usersService.updateUser(name, user, updatePassword);
      if (updatedUser) {
        await this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
        return res.status(200).json(updatedUser);
      }
    } catch (error) {
      throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      return undefined;
    }
  }

  @Delete('/:name')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Delete user, authguard required`,
    description: 'Elimina un usuario existente de la aplicación. Necesaria autorización',
  })
  @ApiParam({
    description: 'Nombre del usuario para eliminar',
    type: String,
    required: false,
    name: 'name',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Nombre usuario no encontrado',
  })
  async deleteUser(@Res() res: Response, @Param('name') name: string): Promise<Response<boolean, Record<string, boolean>>> {
    const existUser: IUser = await this.usersService.findUserByName(name);
    if (!existUser) {
      console.log(`[deleteUser] User not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    try {
      const deletedUser: boolean = await this.usersService.deleteUser(name);
      if (deletedUser) {
        await this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
      }
      return res.status(200).json(deletedUser);
    } catch (error) {
      throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
