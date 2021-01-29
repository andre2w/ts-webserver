export interface Headers {
  [name: string]: string;
}

export interface Cookies {
  [name: string]: string;
}

export interface HttpRequestLine {
  method: string;
  uri: string;
  version: string;
}

export type HttpRequest = HttpRequestLine & {
  headers: Headers;
  cookies: Cookies;
};

export class InvalidRequestError extends Error {}

export interface Cookie {
  value: string;
  expires?: Date;
}

export class HttpResponse {
  constructor(
    public code: number,
    public body?: string,
    private _headers: Map<string, string> = new Map(),
    private _cookies: Map<string, Cookie> = new Map()
  ) {}

  get headers(): Map<string, string> {
    return this._headers;
  }

  addHeader(name: string, value: string): void {
    this._headers.set(name, value);
  }

  get cookies(): Map<string, Cookie> {
    return this._cookies;
  }

  addCookie(name: string, value: string, expires?: Date): void {
    expires = expires;
    this._cookies.set(name, { value, expires });
  }

  hasBody(): boolean {
    return this.body !== undefined;
  }

  bodyLength(): number {
    return this.body?.length || 0;
  }
}
