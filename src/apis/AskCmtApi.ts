import {ApiResponse} from "@/pages/utils/commonInterface";
import {API_SEVER_HOST} from "@/apis/host";
import axios, {AxiosResponse} from "axios";
import {apiException} from "@/pages/utils/exceptionUtils";

const prefix = `${API_SEVER_HOST}/api/askcmt`;

type askCmt = {
    askId: number;
    content: string;
};

// 댓글 작성
export const createAskCmt = async (request: askCmt) : Promise<ApiResponse<askCmt>> => {
    // 토큰 정보
    const accessToken = localStorage.getItem("accessToken");

    // 서버요청
    try {
        const res : AxiosResponse<ApiResponse<askCmt>> = await axios.post(`${prefix}/`, request, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 댓글 삭제
export const deleteAskCmt = async (id : number) : Promise<ApiResponse<null | unknown>> => {
    // 토큰 정보
    const accessToken = localStorage.getItem("accessToken");

    try {
        // 서버 요청
        const res : AxiosResponse<ApiResponse<null | unknown>> = await axios.delete(`${prefix}/${id}`, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }

}

// 댓글 신고
export const reportAskCmt = async (id : number) : Promise<ApiResponse<null | unknown>> => {
    // 토큰 정보
    const accessToken = localStorage.getItem("accessToken");

    try {
        // 서버 요청
        const res : AxiosResponse<ApiResponse<null | unknown>> = await axios.post(`${prefix}/${id}`, {} , {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }

}