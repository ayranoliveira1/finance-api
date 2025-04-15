export abstract class HashGenerate {
  abstract hash(plain: string): Promise<string>
}
