import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './schema/users.entity';
import { Repository } from 'typeorm';
import { SignupInput } from 'src/auth/dto/auth.dto';
import { LoginRespone } from 'src/common/response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>
    ) {}

    async getUserByUsername(userName: string) 
    : Promise<User> {
        const user = await this.UserRepository.findOneBy({userName});

        return user;
    }

    async validateSignupInput(signupInput: SignupInput)
    : Promise<User> {
        const { userName, password } = signupInput;
        const user = await this.getUserByUsername(userName);

        if(user) {
            throw new BadRequestException('This username is exist!');
        }
        const newUser = new User();
        newUser.userName = userName;
        newUser.password = await bcrypt.hash(password, 8);
        return await this.UserRepository.save(newUser);
    }

    async getAllProfiles() : Promise<User[]> {
        return await this.UserRepository.find();
    }
}
