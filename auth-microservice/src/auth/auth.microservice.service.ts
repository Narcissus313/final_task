import { Inject, Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import {
  UserDto,
  VerifyOtpDto,
  UserCredentialsToLoginDto,
  AdminLoginDto,
} from './auth.dto';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthMicroserviceService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  generateOtp(): string {
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
    return otp;
  }

  async sendOtpToUserMail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP Verification',
      html: `
        <html>
            <body>
                <h1>Hi, Dear!</h1>
                Your OTP is: <p style="color: blue; font-size: 36px;">${otp}</p>
            </body>
        </html>
    `,
    };

    transporter.sendMail(mailOptions, () =>
      console.log('otp sent to user mail'),
    );
  }

  async createNewOtpInDb(newOtpDto: VerifyOtpDto) {
    const newOtp = this.otpRepository.create(newOtpDto);
    return await this.otpRepository.save(newOtp);
  }

  async createOtpSaveOtpSendOtp(email: string) {
    const otp = this.generateOtp();
    await this.sendOtpToUserMail(email, otp);
    const newOtp = await this.createNewOtpInDb({
      email,
      otp,
    });
    return newOtp;
  }

  async checkIfOtpAlreadyExistsForEmail(email: string) {
    const targerEmailOtp = await this.otpRepository.findOneBy({ email });
    return targerEmailOtp;
  }

  async validateUser(
    userCredentialsToLogin: UserCredentialsToLoginDto,
  ): Promise<any> {
    const targetUser = await lastValueFrom(
      this.findUserByEmail(userCredentialsToLogin.email),
    );
    if (
      targetUser &&
      (await bcrypt.compare(
        userCredentialsToLogin.password,
        targetUser.password,
      ))
    ) {
      const { password, ...user } = targetUser;
      return user;
    }
    return null;
  }

  async validateAdmin(adminCredentialsToLogin: AdminLoginDto): Promise<any> {
    const admin = await lastValueFrom(
      this.usersClient.send({ cmd: 'findAdmin' }, adminCredentialsToLogin),
    );

    if (
      admin &&
      (await bcrypt.compare(adminCredentialsToLogin.password, admin.password))
    )
      return admin;

    return null;
  }

  async login(user: UserDto) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(user: AdminLoginDto) {
    const payload = { usrename: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findUserByEmail(email: string) {
    return this.usersClient.send({ cmd: 'checkUserExistance' }, email);
  }

  async findOtpByEmail(email: string) {
    return await this.otpRepository.findOneBy({ email });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async deleteExpiredUsers() {
    const expirationTime = new Date(
      Date.now() - parseInt(process.env.OTP_EXPIRE_TIME, 10) * 1000,
    );

    await this.otpRepository.delete({
      createdAt: LessThan(expirationTime),
    });
  }
}
