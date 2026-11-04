export const API_ERROR_CODE_VALUES = [
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'INVALID_TRANSITION',
  'PERSISTENCE_UNAVAILABLE',
  'INTERNAL_ERROR',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODE_VALUES)[number]

export type ApiFieldErrors = Readonly<Record<string, readonly string[]>>

export interface ApiSuccessResponse<TData> {
  readonly data: TData
}

export interface ApiErrorResponse {
  readonly error: {
    readonly code: ApiErrorCode
    readonly message: string
    readonly fieldErrors: ApiFieldErrors | null
  }
}

export interface PaginationMeta {
  readonly page: number
  readonly pageSize: number
  readonly total: number
  readonly totalPages: number
}

export interface PaginatedApiSuccessResponse<
  TData,
> extends ApiSuccessResponse<TData> {
  readonly meta: PaginationMeta
}
