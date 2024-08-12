export class ApiResponse<T> {
  constructor(
    public status: 'success' | 'fail',
    public statusCode: number,
    public message: string,
    public data: T | null,
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
