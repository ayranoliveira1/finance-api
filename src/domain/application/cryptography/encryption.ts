export abstract class Encryption {
  abstract encrypt(data: string): Promise<string>
  abstract decrypt(encrypted: string): Promise<string>
}
