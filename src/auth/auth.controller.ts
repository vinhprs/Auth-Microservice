import { Controller, Get, Post, Body, Request, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { SignupInput } from './dto/auth.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from 'src/users/schema/users.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  @GrpcMethod('AuthService', 'SignIn')
  async signIn(@Body() loginInput: LoginInput)
  : Promise<any> {
    try {
      const result = await this.authService.signIn(loginInput);
      return {
        accessToken: result.access_token
      };
    } catch(e) {
      return {};
    }
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('signup')
  @GrpcMethod('AuthService', 'SignUp')
  async signUp(@Body() signupInput: SignupInput)
  : Promise<User> {
    try {
      return await this.authService.signUp(signupInput);
    } catch(e) {
      return null;
    }
  }

  @GrpcMethod('AuthService', 'GetAllProfiles')
  async getAllProfiles() : Promise<any> {
    return {
      data: await this.authService.getAllProfiles()
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
