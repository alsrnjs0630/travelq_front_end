import {API_SEVER_HOST} from "@/apis/host";
import axios, {AxiosResponse} from "axios";

const prefix = `${API_SEVER_HOST}/api/user`;

interface ApiResponse<T> {
    success: boolean,
    message: string,
    data: T
}

type MemberData = {
    name: string,
    email: string,
    nickname: string,
    birthday: string,
    address: string
}

// 회원 등록
export const createMember = async (memberData: MemberData): Promise<MemberData> => {
    const formData = new FormData();

    // 전송 Form데이터 생성
    formData.append("name", memberData.name)
    formData.append("email", memberData.email)
    formData.append("nickname", memberData.nickname)
    formData.append("birthday", memberData.birthday)
    formData.append("address", memberData.address)

    try{
        // 정상 동작 시 응답으로 ApiResponse<T>의 data를 리턴
        const res: AxiosResponse<ApiResponse<MemberData>> = await axios.post(`${prefix}/`, formData, {
            withCredentials: true
        });
        return res.data.data;
    }  catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("서버 에러 발생:", error.response.data);
                throw new Error(error.response.data.message);
            } else if (error.request) {
                console.error("잘못된 요청: ", error.request);
                throw new Error('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
            }
        }
        console.error('알 수 없는 오류 발생: ', (error as Error).message);
        throw new Error('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
}