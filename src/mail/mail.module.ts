import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { AppConfigModule } from 'src/config/appconfig.module';

@Module({
  imports: [AppConfigModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
