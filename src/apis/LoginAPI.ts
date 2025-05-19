import {API_SEVER_HOST} from "@/apis/host";
import axios, {AxiosResponse} from "axios";
import {apiException} from "@/pages/utils/exceptionUtils";

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
    }  catch (error : unknown) {
        throw apiException(error)
    }
}