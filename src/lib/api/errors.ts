export type ApiErrorKind =
  | 'invalidUrl'
  | 'encodingFailed'
  | 'decodingFailed'
  | 'network'
  | 'unauthorized'
  | 'server'
  | 'unknown';

/** Port of Swift APIError, with the same user-facing messages. */
export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static invalidUrl = () => new ApiError('invalidUrl', 'Invalid URL');
  static encodingFailed = () => new ApiError('encodingFailed', 'Failed to encode request');
  static decodingFailed = () => new ApiError('decodingFailed', 'Failed to decode response');
  static network = (message: string) => new ApiError('network', message);
  static unauthorized = () => new ApiError('unauthorized', 'Unauthorized. Please sign in again.', 401);
  static server = (status: number, message: string) => new ApiError('server', `Error ${status}: ${message}`, status);
  static unknown = () => new ApiError('unknown', 'An unknown error occurred');
}

export const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : ApiError.unknown().message;

/** Matches HTTPURLResponse.localizedString(forStatusCode:); RN's `statusText` is often empty. */
const STATUS_TEXT: Record<number, string> = {
  400: 'bad request',
  401: 'unauthorized',
  402: 'payment required',
  403: 'forbidden',
  404: 'not found',
  405: 'method not allowed',
  408: 'request timed out',
  409: 'conflict',
  410: 'no longer exists',
  413: 'request too large',
  415: 'unsupported media type',
  422: 'unprocessable entity',
  429: 'too many requests',
  500: 'internal server error',
  501: 'unimplemented',
  502: 'bad gateway',
  503: 'service unavailable',
  504: 'gateway timed out',
};

export function statusText(status: number, fallback?: string): string {
  if (fallback) return fallback;
  if (STATUS_TEXT[status]) return STATUS_TEXT[status];
  if (status >= 500) return 'server error';
  if (status >= 400) return 'client error';
  return 'unknown';
}
