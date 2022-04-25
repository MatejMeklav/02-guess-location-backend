import { Controller, Post, Param } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm/:token')
  async confirm(@Param() params) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      params.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }
}
