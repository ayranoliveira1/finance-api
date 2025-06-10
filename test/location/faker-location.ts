import { LocationMethods } from '@/domain/application/location/location'

export class FakerLocation implements LocationMethods {
  async getLocationByIp(ip: string) {
    if (!ip) return null

    return {
      country: 'Fake Country',
      city: 'Fake City',
      region: 'Fake Region',
    }
  }
}
