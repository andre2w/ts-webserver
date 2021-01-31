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

export class HttpRequest {
  readonly method: string;
  readonly uri: string;
  readonly version: string;
  readonly headers: Map<string, string> = new Map();
  readonly cookies: Map<string, string> = new Map();

  constructor(requestLine: HttpRequestLine) {
    this.method = requestLine.method;
    this.uri = requestLine.uri;
    this.version = requestLine.version;
  }

  addHeader(name: string, value: string): void {
    this.headers.set(name, value);
  }

  addCookie(name: string, value: string): void {
    this.cookies.set(name, value);
  }
}

export class InvalidRequestError extends Error {}

export interface CookieAttributes {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export type Cookie = CookieAttributes & {
  value: string;
};

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

  addCookie(
    name: string,
    value: string,
    attributes: CookieAttributes = {}
  ): void {
    this._cookies.set(name, { ...attributes, value });
  }

  hasBody(): boolean {
    return this.body !== undefined;
  }

  bodyLength(): number {
    return this.body?.length || 0;
  }
}
