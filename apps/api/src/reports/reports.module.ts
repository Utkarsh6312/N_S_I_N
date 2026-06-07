import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report, ReportSchema } from '../schemas/report.schema';
import { Entity, EntitySchema } from '../schemas/entity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Entity.name, schema: EntitySchema }
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
