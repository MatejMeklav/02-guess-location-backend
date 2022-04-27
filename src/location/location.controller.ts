import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/users/auth/jwt-auth.guard';
import { CreateLocationDto } from './dto/create-location-dto';
import { DeleteLocationDto } from './dto/delete-location-dto';
import { EditLocationDto } from './dto/edit-location-dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createLocation(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    //createLocationDto.image = image.buffer;
    return await this.locationService.createLocation(
      req.userId,
      createLocationDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('update-image')
  @UseInterceptors(FileInterceptor('image'))
  async updateLocationImage(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() editLocationDto: EditLocationDto,
  ) {
    return await this.locationService.editLocation(editLocationDto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-location')
  async deleteLocation(
    @Request() req,
    @Body() deleteLocationDto: DeleteLocationDto,
  ) {
    return this.locationService.deleteLocation(req.user.id, deleteLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-user-locations')
  async getAllUserLocations(@Request() req) {
    return await this.locationService.allLocationsOfUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-locations')
  async getAllLocations(@Request() req) {
    return await this.locationService.allLocations();
  }
}
