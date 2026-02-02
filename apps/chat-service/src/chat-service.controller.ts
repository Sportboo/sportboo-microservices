import { Controller, Get } from '@nestjs/common';
import { ChatServiceService } from './chat-service.service';

@Controller()
export class ChatServiceController {
  constructor(private readonly chatServiceService: ChatServiceService) {}

  @Get()
    getRootPage(): string {
      return this.chatServiceService.getRootPage();
    }
}
