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
