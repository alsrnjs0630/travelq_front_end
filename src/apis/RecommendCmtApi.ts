import {ApiResponse} from "@/pages/utils/commonInterface";
import {API_SEVER_HOST} from "@/apis/host";
import {apiException} from "@/pages/utils/exceptionUtils";
import axios, {AxiosResponse} from "axios";

const prefix = `${API_SEVER_HOST}/api/recommendcmt`;

// CommentRequest
type CommentRequest = {
    recommendId: number;
    content: string;
}

// 댓글 등록 api
export const createRecommendCmt = async (requestParam: CommentRequest) : Promise<ApiResponse<CommentRequest>> =>  {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    console.log("댓글 등록 요청: ", requestParam);

    // 서버 요청
    try {
        const res : AxiosResponse<ApiResponse<CommentRequest>> = await axios.post(`${prefix}/`, requestParam, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 댓글 삭제 api
export const deleteRecommendCmt = async (id: number) : Promise<ApiResponse<null | unknown>> => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    // 서버 요청
    try {
        const res : AxiosResponse<ApiResponse<null | unknown>> = await axios.delete(`${prefix}/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 댓글 신고 api
export const reportRecommendCmt = async (id: number) : Promise<ApiResponse<null | unknown>>  => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    // 서버 요청
    try {
        const res : AxiosResponse<ApiResponse<null | unknown>> = await axios.put(`${prefix}/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}