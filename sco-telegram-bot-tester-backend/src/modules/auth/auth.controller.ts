import { EmailerService } from './../emailer/emailer.service';
import { httpErrorMessages } from '../../constants/http-error-messages.constants';
import { Controller, Post, Body, HttpException, HttpStatus, Res, Get, Param, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { Token } from './class/token';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/interface/iuser.interface';
import { usersConstants } from '../users/constants/user.constants';
import { Response, Request } from 'express';
import { websocketEvents } from '../websocket/constants/websocket.events';
import { BcryptService } from '../shared/bcrypt/bcrypt.service';
import { UserDto } from '../users/dto/user.dto';
import { translateConstants } from '../shared/translate/translate.constants';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { RoleConstants } from '../users/constants/role.constants';

@Controller('api/v1/auth')
@ApiTags('Autentificación')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly emailerService: EmailerService,
    private readonly websocketsService: WebsocketGateway,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: `Login`,
    description: 'Iniciar sesión en la aplicación',
  })
  @ApiBody({
    description: 'Ejemplo de inicio de sesión utilizando la clase LoginDto',
    type: LoginDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          password: usersConstants.PUBLIC.PASSWORD,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión iniciada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas',
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario no activado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Token de usuario no generado',
  })
  async login(@Res() res: Response, @Body() login: LoginDto): Promise<Response<Token, Record<string, Token>>> {
    const existUser: IUser = login.name.includes('@') 
      ? await this.usersService.findUserByEmail(login.name)
      : await this.usersService.findUserByName(login.name);
    
    if (!existUser) {
      console.log(`[login] User '${login.name}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const credentialsOK: boolean = await this.bcryptService.comparePasswords(login.password, existUser);
    if (!credentialsOK) {
      console.log(`[login] Invalid credentials`);
      throw new HttpException(httpErrorMessages.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (existUser.active == false) {
      console.log(`[login] User '${existUser.name}' not actived`);
      throw new HttpException(httpErrorMessages.AUTH.USER_NOT_ACTIVED, HttpStatus.UNAUTHORIZED);
    }

    const token: Token = await this.authService.generateToken(existUser);
    if (!token) {
      console.log(`[login] Unnable to generate user token`);
      throw new HttpException(httpErrorMessages.AUTH.UNNABLE_USER_TOKEN, HttpStatus.CONFLICT);
    }

    return res.status(200).json(token);
  }

  
  @Post('register')
  @ApiOperation({
    summary: `Register`,
    description: 'Registrar un usuario en la aplicación',
  })
  @ApiBody({
    description: 'Ejemplo de registro de usuario utilizando la clase UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          email: usersConstants.PUBLIC.EMAIL,
          password: usersConstants.PUBLIC.PASSWORD,
          role: usersConstants.PUBLIC.ROLE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario registrado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya está registrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya esta registrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible registrar el usuario',
  })
  async register(@Req() req: Request, @Res() res: Response, @Body() user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersService.findUserByName(user.name);
    if (existUser) {
      console.log(`[register] User '${user.name}' already exist`);
      throw new HttpException(httpErrorMessages.USERS.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const existEmail: IUser = await this.usersService.findUserByEmail(user.email);
    if (existEmail) {
      console.log(`[register] Email '${user.email}' already exist`);
      throw new HttpException(httpErrorMessages.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    user.active = false;
    user.role = RoleConstants.USER

    const createdUser: IUser = await this.usersService.addUser(user);
    if (!createdUser) {
      console.log(`[register] User '${user.name}' unnable to create`);
      throw new HttpException(httpErrorMessages.USERS.CREATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const lang: string = req && req.headers && req.headers.clientlanguage 
      ? req.headers.clientlanguage.toString() 
      : translateConstants.DEFAULT_LANGUAGE;

    const emailSended: boolean = await this.emailerService.sendActiveUserEmail(user, lang);
    if (!emailSended) {
      console.log(`[register] User '${user.name}' unnable to send activate email`);
    }
    
    console.log(`[register] User '${user.name}' created successfully`);
    await this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
    return res.status(200).json(createdUser);
  }

  @ApiOperation({
    summary: `Request password`,
    description: 'Solicitar un reinicio de contraseña del usuario',
  })
  @ApiQuery({
    description: 'Email del usuario para envíar el link de reinicio de contraseña',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de reinicio de contraseña envíado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible actualizar el usuario',
  })
  @Get('request-password/:email')
  async requestPassword(@Req() req: Request, @Res() res: Response, @Param('email') email: string): Promise<Response<boolean, Record<string, boolean>>> {
    const existUser: IUser = await this.usersService.findUserByEmail(email);
    if (!existUser) {
      console.log(`[requestPassword] Email '${email}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    existUser.pwdRecoveryToken = await this.bcryptService.generateToken();
    existUser.pwdRecoveryDate = new Date();

    const userDto: UserDto = await this.usersService.modelToDto(existUser);
    const updatedUser: IUser = await this.usersService.updateUser(userDto._id, userDto);
    if (!updatedUser) {
      console.log(`[requestPassword] User '${userDto.name}' unnable to update`);
      throw new HttpException(httpErrorMessages.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);

    const lang: string = req && req.headers && req.headers.clientlanguage ? req.headers.clientlanguage.toString() : translateConstants.DEFAULT_LANGUAGE;
    const emailSended: boolean = await this.emailerService.sendReoveryPasswordEmail(await this.usersService.modelToDto(updatedUser), lang);
    return res.status(200).json(emailSended);
  }

  @ApiOperation({
    summary: `Reset password`,
    description: 'Reiniciar contraseña del usuario',
  })
  @ApiQuery({
    description: 'Token de reinicio de contraseña del usuario',
    type: String,
    required: false,
    name: 'pwdRecoveryToken',
  })
  @ApiBody({
    description: 'Ejemplo de reinicio de contraseña utilizando la clase UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          email: usersConstants.PUBLIC.EMAIL,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email de reinicio de contraseña envíado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible actualizar el usuario',
  })
  @Put('reset-password/:pwdRecoveryToken')
  async resetPassword(
    @Res() res: Response, 
    @Param('pwdRecoveryToken') pwdRecoveryToken: string, 
    @Body() user: UserDto
  ): Promise<Response<boolean, Record<string, boolean>>> {
    const users: IUser[] = await this.usersService.fetchUsers({ pwdRecoveryToken: pwdRecoveryToken });
    if (!users || (users && users.length == 0)) {
      console.log(`[resetPassword] User '${user.name}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    users[0].pwdRecoveryToken = null;
    users[0].pwdRecoveryDate = null;
    users[0].password = await this.bcryptService.encryptPassword(user.password);

    const userDto: UserDto = await this.usersService.modelToDto(users[0]);
    const updatedUser: IUser = await this.usersService.updateUser(userDto._id, userDto, true);
    if (!updatedUser) {
      console.log(`[resetPassword] User '${userDto.name}' unnable to update`);
      throw new HttpException(httpErrorMessages.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
    return res.status(200).json(true);
  }

  @ApiOperation({
    summary: `Get User Recovery Password`,
    description: 'Recuperar el usuario según su token de reinicio de contraseña',
  })
  @ApiQuery({
    description: 'Token de reinicio de contraseña del usuario',
    type: String,
    required: false,
    name: 'pwdRecoveryToken',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario recuperado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Get('getUserRecoveryPassword/:pwdRecoveryToken')
  async getUserRecoveryPassword(@Res() res: Response, @Param('pwdRecoveryToken') pwdRecoveryToken: string): Promise<Response<IUser, Record<string, IUser>>> {
    const users: IUser[] = await this.usersService.fetchUsers({ pwdRecoveryToken: pwdRecoveryToken });
    if (!users || (users && users.length == 0)) {
      console.log(`[getUserRecoveryPassword] User recovery token '${pwdRecoveryToken}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return res.status(200).json(users[0]);
  }

  @ApiOperation({
    summary: `Get User Email`,
    description: 'Recuperar el usuario según su email',
  })
  @ApiQuery({
    description: 'Email del usuario',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario recuperado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Get('getUserEmail/:email')
  async getUserEmail(@Res() res: Response, @Param('email') email: string): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersService.findUserByEmail(email);
    if (!existUser) {
      console.log(`[getUserEmail] User email '${email}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return res.status(200).json(existUser);
  }

  @ApiOperation({
    summary: `Confirm email`,
    description: 'Confirmar el email de un usuario y activarlo',
  })
  @ApiQuery({
    description: 'Email del usuario',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email confirmado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible actualizar el usuario',
  })
  @Get('confirmEmail/:email')
  async confirmEmail(@Res() res: Response, @Param('email') email: string): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersService.findUserByEmail(email);
    if (!existUser) {
      console.log(`[confirmEmail] User email '${email}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    existUser.active = true;

    const userDto: UserDto = await this.usersService.modelToDto(existUser);
    const updatedUser: IUser = await this.usersService.updateUser(userDto._id, userDto);
    if (!updatedUser) {
      console.log(`[confirmEmail] User '${userDto.name}' unnable to update`);
      throw new HttpException(httpErrorMessages.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.websocketsService.notifyWebsockets(websocketEvents.WS_USERS);
    return res.status(200).json(true);
  }

  @ApiOperation({
    summary: `Validate token`,
    description: 'Valida el token del usuario',
  })
  @ApiBody({
    description: 'Ejemplo de validación de token utilizando la clase UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: usersConstants.PUBLIC.NAME,
          email: usersConstants.PUBLIC.EMAIL,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token validado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'El tiempo de sesión ha expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible crear el nuevo token',
  })
  @Post('validate-token')
  async validateToken(@Req() req: Request, @Res() res: Response, @Body() user: UserDto): Promise<Response<Token, Record<string, Token>>> {
    const existUser: IUser = await this.usersService.findUserByName(user.name);
    if (!existUser) {
      console.log(`[validateToken] User '${user.name}' not found`);
      throw new HttpException(httpErrorMessages.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result: boolean = await this.authService.validateAccessToken(req);
    if (!result) {
      throw new HttpException(httpErrorMessages.AUTH.SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    const token: Token = await this.authService.generateToken(existUser);
    if (!token) {
      console.log(`[validateToken] Unnable to generate user token`);
      throw new HttpException(httpErrorMessages.AUTH.UNNABLE_USER_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(200).json(token);
  }
}
