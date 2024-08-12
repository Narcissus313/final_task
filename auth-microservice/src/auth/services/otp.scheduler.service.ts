import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OtpEntity } from '../otp.entity';

@Injectable()
export class OtpScheduler {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredUsers() {
    const expirationTime = new Date(Date.now() - 10 * 1000);

    await this.otpRepository.delete({
      createdAt: LessThan(expirationTime),
    });

    console.log('Expired users deleted');
  }
}
