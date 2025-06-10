import { LocationMethods } from '@/domain/application/location/location'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LocationService implements LocationMethods {
  async getLocationByIp(ip: string) {
    const response = await fetch(`http://ip-api.com/json/${ip}`)

    if (!response.ok) {
      return null
    }

    const result = await response.json()

    return {
      country: result.country ?? 'unknown',
      city: result.city ?? 'unknown',
      region: result.regionName ?? 'unknown',
    }
  }
}
