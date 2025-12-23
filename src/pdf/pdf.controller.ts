import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // @MessagePattern('createPdf')
  // create(@Payload() createPdfDto: CreatePdfDto) {
  //   return this.pdfService.create(createPdfDto);
  // }

  // @MessagePattern('findAllPdf')
  // findAll() {
  //   return this.pdfService.findAll();
  // }

  // @MessagePattern('findOnePdf')
  // findOne(@Payload() id: number) {
  //   return this.pdfService.findOne(id);
  // }

  // @MessagePattern('updatePdf')
  // update(@Payload() updatePdfDto: UpdatePdfDto) {
  //   return this.pdfService.update(updatePdfDto.id, updatePdfDto);
  // }

  // @MessagePattern('removePdf')
  // remove(@Payload() id: number) {
  //   return this.pdfService.remove(id);
  // }
}
