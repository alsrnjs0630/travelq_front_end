import axios from "axios";

export const apiException = (error : unknown) : Error => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            console.error("서버 에러 발생:", error.response.data);
            return new Error(error.response.data?.message || "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else if (error.request) {
            console.error("잘못된 요청: ", error.request);
            return new Error('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
        }
    }
    console.error('알 수 없는 오류 발생: ', (error as Error).message);
    return new Error('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
}
