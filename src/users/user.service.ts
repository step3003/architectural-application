import {IUserService} from "./user.service.intreface";
import {UserRegisterDto} from "./dto/user-register.dto";
import {User} from "./user.entity";
import {UserLoginDto} from "./dto/user-login.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";
import {IUserRepository} from "./user.repository.interface";
import {UserModel} from "@prisma/client";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {
    }

    async create({email, name, password}: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        const existedUser = await this.userRepository.find(email);
        if (existedUser) {
            return null;
        }

        return this.userRepository.create(newUser);
    }

    async getUserInfo(email: string) {
        const existedUser = await this.userRepository.find(email);
        if (!existedUser) {
            return null;
        }

        return existedUser;
    }

    async validateUser({ email, password}: UserLoginDto): Promise<boolean> {
        const existedUser = await this.userRepository.find(email);
        if (!existedUser) {
            return false;
        }
        const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

        return newUser.comparePassword(password);
    }
}