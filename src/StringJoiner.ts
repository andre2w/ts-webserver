export default class StringJoiner {
  private lines: string[] = [];

  constructor(
    private readonly separator: string,
    private options: { preffix?: string; suffix?: string } = {}
  ) {}

  add(text: string): void {
    this.lines.push(text);
  }

  toString(): string {
    let preffix = this.options.preffix || "";
    let suffix = this.options.suffix || "";
    return `${preffix}${this.lines.join(this.separator)}${suffix}`;
  }
}
