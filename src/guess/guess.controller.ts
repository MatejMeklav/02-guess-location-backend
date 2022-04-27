import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/auth/jwt-auth.guard';
import { CreateGuessDto } from './dto/create-guess-dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { GuessService } from './guess.service';

@Controller('guess')
export class GuessController {
  constructor(private guessService: GuessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGuess(@Request() req, @Body() createGuessDto: CreateGuessDto) {
    return await this.guessService.createGuess(req.user.id, createGuessDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateGuess(@Request() req, @Body() updateGuessDto: UpdateGuessDto) {
    return await this.guessService.updateGuess(req.user.id, updateGuessDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getGuessesOfUser(@Request() req) {
    return await this.guessService.getGuessesByUserId(req.user.id);
  }
}
