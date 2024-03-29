import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { CreateLocationDto } from '../location/dto/create-location-dto';
import { DeleteLocationDto } from './dto/delete-location-dto';
import { EditLocationDto } from '../location/dto/edit-location-dto';
import { LocationService } from '../location/location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createLocation(
    @Request() req,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    console.log(req);
    return await this.locationService.createLocation(
      req.user.id,
      createLocationDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('update-image')
  async updateLocationImage(
    @Request() req,
    @Body() editLocationDto: EditLocationDto,
  ) {
    return await this.locationService.editLocation(editLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-location')
  async deleteLocation(@Request() req, @Body() data: { locationId: string }) {
    const deleteLocationDto: DeleteLocationDto = { id: data.locationId };
    console.log(data.locationId);
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

  @UseGuards(JwtAuthGuard)
  @Get('location-id/:id')
  async getLocation(@Request() req, @Param() params) {
    return await this.locationService.getLocationById(params.id);
  }
}
