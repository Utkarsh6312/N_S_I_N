import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: any) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('scan')
  scan(@Query('q') q: string) {
    if (!q) return { error: 'Query parameter "q" is required' };
    return this.reportsService.scan(q);
  }

  @Get('heatmap')
  getHeatmap() {
    return this.reportsService.getHeatmapData();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }
}
