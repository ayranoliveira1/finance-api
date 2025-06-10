import { Module } from '@nestjs/common'
import { LocationService } from './location.service'
import { LocationMethods } from '@/domain/application/location/location'

@Module({
  providers: [
    LocationService,
    {
      provide: LocationMethods,
      useClass: LocationService,
    },
  ],
  exports: [LocationService, LocationMethods],
})
export class LocationModule {}
