import axios from "axios";
import {API_SEVER_HOST} from "@/apis/host";

const prefix = `${API_SEVER_HOST}/api/asks`;

// 게시글 목록 요청 param 타입 지정
type PageParam = {
    page : number,
    size? : number,
    title? : string,
    author? : string
};

// 질문 게시글 목록 api
export const getAskList = async (pageParam: PageParam ) => {
    const {page, size, title, author} = pageParam;

    const res = await axios.get(`${prefix}/list`, {
        params: {
            page: page,
            size: size,
            title: title,
            author: author
        }
    });

    console.log("getAskList 응답 데이터", res.data)

    return res.data;
}