import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('createMail')
  create(@Payload() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto);
  }

  @MessagePattern('findAllMail')
  findAll() {
    return this.mailService.findAll();
  }

  @MessagePattern('findOneMail')
  findOne(@Payload() id: number) {
    return this.mailService.findOne(id);
  }

  @MessagePattern('updateMail')
  update(@Payload() updateMailDto: UpdateMailDto) {
    return this.mailService.update(updateMailDto.id, updateMailDto);
  }

  @MessagePattern('removeMail')
  remove(@Payload() id: number) {
    return this.mailService.remove(id);
  }
}
