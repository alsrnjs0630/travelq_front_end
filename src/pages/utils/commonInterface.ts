// 요청 응답 객체
export interface ApiResponse<T> {
    success: boolean,
    message: string,
    data: T
}

