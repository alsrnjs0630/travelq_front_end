import axios, {AxiosResponse} from "axios";
import {API_SEVER_HOST} from "@/apis/host";
import {apiException} from "@/pages/utils/exceptionUtils";
import {ApiResponse} from "@/pages/utils/commonInterface";

const prefix = `${API_SEVER_HOST}/api/asks`;

// 게시글 목록 요청 param 타입 지정
type PageParam = {
    page : number,
    size? : number,
    title? : string,
    author? : string
};

type AskPageData = {
    contents: AskItem[];
    pageNumbers: number[];
    prev: boolean;
    next: boolean;
    totalCount: number;
    prevPage: number;
    nextPage: number;
    totalPage: number;
    currentPage: number;
    search?: SearchType;
};

// PageDTO의 content 타입
type AskItem = {
    id: number;
    title: string;
    author: string;
    content: string;
    viewCount: number;
    reportCount: number;
    state: string;
    createdAt: Date;
    updatedAt: Date;
};

// 검색 조건
type SearchType = {
    title: string;
    author: string;
};

// 질문 게시글 데이터
type PostData = {
    title: string,
    content: string,
}


// 질문 게시글 목록 api
export const getAskList = async (pageParam: PageParam ) : Promise<AskPageData> => {
    const {page, size, title, author} = pageParam;

    try{
        const res : AxiosResponse<AskPageData> = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                title: title,
                author: author
            }
        });

        console.log("getAskList 응답 데이터", res.data)

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 질문 게시글 등록 api
export const createAsk = async (postData: PostData) : Promise<ApiResponse<PostData>> => {
    const accessToken = localStorage.getItem("accessToken");

    // 전송 데이터
    const requestData = {
        title : postData.title,
        content : postData.content
    };

    try {
        const res : AxiosResponse<ApiResponse<PostData>> = await axios.post(`${prefix}/`, requestData, {
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${accessToken}`
            }
        });

        console.log("게시글 등록 응답 데이터", res.data);

        return res.data
    } catch (error) {
        throw apiException(error);
    }
}

// 질문 게시글 상세 api
export const detailAsk = async (id : number) : Promise<AskItem> => {
    try {
        // 질문 게시글 상세페이지 요청
        const res : AxiosResponse<ApiResponse<AskItem>> = await axios.get(`${prefix}/${id}`);
        console.log("요청 응답 : ", res.data);
        console.log("질문 게시글 상세 페이지 내용 : ", res.data.data);
        return res.data.data;
    } catch (error) {
        throw apiException(error);
    }
}

// 질문 게시글 삭제 api
export const deleteAsk = async (id : number) : Promise<ApiResponse<unknown | null>> => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        // 질문 게시글 삭제 요청
        const res : AxiosResponse<ApiResponse<unknown | null>> = await axios.delete(`${prefix}/${id}`, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 질문 게시글 수정 api
export const updateAsk = async (id : number, updatedPost : PostData) : Promise<ApiResponse<PostData>> => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    // 수정 내역 (updatedDTO)
    const updatedDTO = {
        title: updatedPost.title,
        content: updatedPost.content
    };

    try {
        // 질문 게시글 수정 요청
        const res = await axios.put(`${prefix}/${id}`, updatedDTO, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 수정 권한 확인
export const checkAuth = async (id: number) : Promise<ApiResponse<unknown | null>> => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    try {
        // 수정 권한 확인 (상세 페이지 수정 버튼)
        const res : AxiosResponse<ApiResponse<unknown | null>> = await axios.get(`${prefix}/${id}/authcheck`, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;
    } catch (error) {
        throw apiException(error);
    }
}