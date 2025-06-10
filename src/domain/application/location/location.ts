import { LocationResponse } from '@/core/@types/location'

export abstract class LocationMethods {
  abstract getLocationByIp(ip: string): Promise<LocationResponse | null>
}
