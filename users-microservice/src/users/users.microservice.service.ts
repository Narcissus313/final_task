import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from './users.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewUserDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from 'src/auth/auth.dto';

@Injectable()
export class UsersMicroserviceService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewUser(createNewUserInfo: CreateNewUserDto) {
    const newUserPassword = createNewUserInfo.password;
    const hashedPassword = await bcrypt.hash(
      newUserPassword,
      parseInt(process.env.HASH_ROUNDS, 10),
    );
    Object.assign(createNewUserInfo, {
      password: hashedPassword,
    });

    const newUser = this.userRepository.create(createNewUserInfo);

    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string) {
    const targetUser = await this.userRepository.findOneBy({ email });
    return targetUser;
  }

  async updateUser(upateUserCredentials: UpdateUserDto) {
    const { email, password } = upateUserCredentials;
    const targetUser = await this.userRepository.findOneBy({ email });

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_ROUNDS, 10),
    );
    targetUser.password = hashedPassword;
    await this.userRepository.save(targetUser);
    return targetUser;
  }

  async findAdmin(adminCredentials: AdminLoginDto) {
    const { username, password: adminPassword } = adminCredentials;
    const admin = await this.userRepository.findOne({
      where: { username, role: UserRole.ADMIN },
    });

    if (!admin || !(await bcrypt.compare(adminPassword, admin.password)))
      return null;

    return admin;
  }
}
