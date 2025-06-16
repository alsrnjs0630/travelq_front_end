import {API_SEVER_HOST} from "@/apis/host";
import axios, {AxiosResponse} from "axios";
import {apiException} from "@/pages/utils/exceptionUtils";
import {ApiResponse} from "@/pages/utils/commonInterface";

const prefix = `${API_SEVER_HOST}/api/recommends`;

type PageParam = {
    page : number;
    size? : number;
    title? : string;
    author? : string;
};

// PageDTO
type RcmPageData = {
    contents: RecommendItem[];
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

// PageDTO의 content 타입 (AskResponseDTO)
type RecommendItem = {
    id : number;
    memberId : number;
    author : string;
    title : string;
    content : string;
    likeCount : number;
    viewCount : number;
    state : string;
    reportCount : number;
    images : string[];
    recommendCmts : RecommendComment[];
    createdAt : Date;
    updatedAt : Date;
};

// 검색 조건
type SearchType = {
    title: string;
    author: string;
};

// 게시글 등록 DTO
type CreatePost = {
    title: string;
    content: string;
    images: File[];
}

// RcmUpdateDTO
type updateForm = {
    title: string;
    content: string;
    originalImages: string[];
    newImages: File[];
    deletedImages: string[];
}

// RecommendCmts
type RecommendComment = {
    id: number;
    recommendId: number;
    memberId: number;
    author: string;
    content: string;
    reportCount: number;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}

// 추천 게시글 목록 api
export const getRecommendList = async (pageParam: PageParam ) : Promise<RcmPageData> => {
    const {page, size, title, author} = pageParam;

    console.log("추천 게시글 목록 조회 접근 확인");

    try{
        const res : AxiosResponse<RcmPageData> = await axios.get(`${prefix}/list`, {
            params: {
                page: page,
                size: size,
                title: title,
                author: author
            }
        });

        console.log("getRecommendList 응답 데이터", res.data)

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
};

// 추천 게시글 조회 api
export const detailRecommendPost = async (id : number) : Promise<RecommendItem> => {
    try {
        // 서버 api 요청
        const res : AxiosResponse<ApiResponse<RecommendItem>> = await axios.get(`${prefix}/${id}`);

        console.log("추천 게시글 상세 페이지 조회 : ", res.data.data);

        return res.data.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 추천 게시글 등록 api
export const createRecommendPost = async (postParam : CreatePost) : Promise<ApiResponse<CreatePost>> => {
    const accessToken = localStorage.getItem("accessToken");
    // 요청 form 생성
    const formData = new FormData();
    formData.append("title", postParam.title);
    formData.append("content", postParam.content);
    // 이미지
    postParam.images.forEach(image => {
        formData.append("images", image);
    });

    try {
        const res : AxiosResponse<ApiResponse<CreatePost>> = await axios.post(`${prefix}/`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log("추천 게시글 등록 : ", res.data);

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
};

// 추천 게시글 삭제 api
export const deleteRecommendPost = async (id: number) : Promise<ApiResponse<null | unknown>> => {
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

// 추천 게시글 수정 권한 확인 api
export const updateAuthCheck = async (id: number) : Promise<ApiResponse<null | unknown>> => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    // 서버 요청
    try {
        const res : AxiosResponse<ApiResponse<null | unknown>> = await axios.get(`${prefix}/${id}/authcheck`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return res.data;

    } catch (error) {
        throw apiException(error);
    }
}

// 추천 게시글 수정 api
export const updateRecommendPost = async (id: number, updateParam: updateForm) : Promise<ApiResponse<updateForm>> => {
    // JWT
    const accessToken = localStorage.getItem("accessToken");

    // 수정 데이터
    const updateFormData = new FormData();

    updateFormData.append("title", updateParam.title);
    updateFormData.append("content", updateParam.content);
    updateParam.originalImages.forEach(imageName => {
        updateFormData.append("originalImages", imageName)
    });
    updateParam.newImages.forEach(image => {
        updateFormData.append("newImages", image)
    });
    updateParam.deletedImages.forEach(imageName => {
        updateFormData.append("deletedImages", imageName)
    });

    // 서버 요청
    try {
        const res : AxiosResponse<ApiResponse<updateForm>> = await axios.put(`${prefix}/${id}`, updateFormData, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });

        return res.data;
    } catch (error) {
        throw apiException(error);
    }
}