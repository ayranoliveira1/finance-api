export abstract class OpenAIRepository {
  abstract generateIAReport(content: string): Promise<string>
}
