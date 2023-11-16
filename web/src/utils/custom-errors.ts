/**
 * fetch()に関連するエラー
 */
export class FetchError extends Error {
  /**
   * HTTPステータスコード
   */
  status: number;

  constructor(message: string, params: { status: number }) {
    super(message);
    this.status = params.status;
  }
}
