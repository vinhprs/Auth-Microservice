import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schema/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly UserService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(loginInput: LoginInput)
        : Promise<any> {
        const { userName, password } = loginInput;
        const user = await this.UserService.getUserByUsername(userName);
        if(!user) {
            throw new NotFoundException('Cannot find user');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password!');
        }

        const payload = { sub: user.id, userName };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(signupInput: SignupInput)
    : Promise<User> {
        return await this.UserService.validateSignupInput(signupInput);
    }

    async getAllProfiles() : Promise<User[]> {
        return await this.UserService.getAllProfiles();
    }
}
