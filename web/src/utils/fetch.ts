import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import { FetchError } from './custom-errors';

interface Options<T = object> {
  params?: T;
  headers?: HeadersInit;
  credentials?: Request['credentials'];
  validateStatus?: (status: number) => boolean;
}

function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

function combineUrls(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

function buildFullPath(baseURL: string, requestedURL: string): string {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineUrls(baseURL, requestedURL);
  }
  return requestedURL;
}

function buildHeaders<T = HeadersInit>(headers?: T): HeadersInit {
  if (!headers) {
    // 未指定(undefined)の場合、`Content-Type: application/json` を返す
    return {
      'Content-Type': 'application/json',
    };
  }

  return headers;
}

function buildCredentials(
  credentials?: Request['credentials']
): Request['credentials'] | undefined {
  if (process.env.NODE_ENV !== 'development') {
    return undefined;
  }

  return credentials;
}

function buildRequestBody<T = object>(body: T): string | FormData | null {
  if (body instanceof FormData) {
    // FormDataの場合、 `JSON.stringify()` せずそのまま返す
    return body;
  }

  if (!body) {
    return null;
  }

  return JSON.stringify(
    snakecaseKeys(body as Parameters<typeof snakecaseKeys>)
  );
}

function buildPathWithSearchParams<T = object>(path: string, params?: T) {
  if (!params || Object.keys(params).length === 0) {
    return path;
  }

  for (const key in params) {
    if (params[key] === undefined) {
      delete params[key]; // URLSearchParamsで`key="undefined"`になるので削除する
    }
  }

  const urlSearchParams = new URLSearchParams(params);
  return `${path}?${urlSearchParams.toString()}`;
}

async function http<T>(
  path: string,
  config: RequestInit,
  validateStatus?: (status: number) => boolean
): Promise<T> {
  const request = new Request(
    buildFullPath(process.env.NEXT_PUBLIC_API_ROOT!, path),
    config
  );
  const res = await fetch(request);

  if (!res.ok) {
    const error = new FetchError('データのfetch中にエラーが発生しました', {
      status: res.status,
    });
    const data = await res.json();
    error.message = data.message;
    throw error;
  } else if (validateStatus && !validateStatus(res.status)) {
    const error = new FetchError(
      'HTTPステータスコードがバリデーションエラーになりました',
      { status: res.status }
    );
    throw error;
  }

  if (res.status === 204) return {} as T; // statusCodeが204のときにres.json()を実行するとエラーになるため

  return camelcaseKeys(await res.json(), { deep: true });
}

export async function get<T, U = object>(
  path: string,
  options?: Options<U>
): Promise<T> {
  return http<T>(
    buildPathWithSearchParams(
      path,
      options?.params ? snakecaseKeys(options.params) : undefined
    ),
    {
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
    },
    options?.validateStatus
  );
}

/**
 * テキスト情報のためのGETリクエスト
 * @note 外部パスでもリクエストできるようにするため第一引数は `https://${string}` とする
 */
export async function getText<U = object>(
  path: `https://${string}`,
  options?: Options<U>
): Promise<string> {
  const request = new Request(path, {
    headers: buildHeaders({
      ...options?.headers,
      'Content-Type': 'text/plain',
    }),
    credentials: buildCredentials(options?.credentials),
  });

  const res = await fetch(request);

  if (!res.ok) {
    const error = new FetchError('データのfetch中にエラーが発生しました', {
      status: res.status,
    });
    const data = await res.json();
    error.message = data.message;
    throw error;
  }

  if (res.status === 204) return '';

  return res.text();
}

export async function post<T, U, V = object>(
  path: string,
  body: T,
  options?: Options<V>
): Promise<U> {
  return http<U>(
    path,
    {
      method: 'POST',
      headers: buildHeaders(options?.headers),
      body: buildRequestBody(body),
      credentials: buildCredentials(options?.credentials),
    },
    options?.validateStatus
  );
}

export async function put<T, U = object>(
  path: string,
  body: T,
  options?: Options<U>
): Promise<U> {
  return http<U>(
    path,
    {
      method: 'PUT',
      body: buildRequestBody(body),
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
    },
    options?.validateStatus
  );
}

// deleteはJSの予約語であるためdestroyとする
export async function destroy<T = object>(
  path: string,
  options?: Options<T>
): Promise<unknown> {
  return http(
    buildPathWithSearchParams(
      path,
      options?.params ? snakecaseKeys(options.params) : undefined
    ),
    {
      method: 'DELETE',
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
    },
    options?.validateStatus
  );
}

/**
 * よく分からんエラーオブジェクトをFetchErrorに変換する
 */
export function parseFetchError(e: unknown): FetchError {
  if (e instanceof FetchError) return e;
  if (!e || typeof e !== 'object')
    return new FetchError('サーバーでエラーが発生しました', { status: 500 });

  const { message, status } = e as Record<string, unknown>;

  return new FetchError(
    typeof message === 'string' ? message : 'サーバーでエラーが発生しました',
    {
      status:
        typeof status === 'number' && status >= 100 && status < 600
          ? status
          : 500,
    }
  );
}
