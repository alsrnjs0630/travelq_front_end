'use client'
import Link from "next/link";
import PageComponent from "@/component/PageComponent";
import useCustomMove from "@/hooks/useCustomMove";
import {getAskList} from "@/apis/AskApi"
import {GetServerSideProps} from "next";

type Props = {
    serverData: AskPageData
};

// PageDTO 응답 결과
type AskPageData = {
    contents: AskItem[],
    pageNumbers: number[],
    prev: boolean,
    next: boolean,
    totalCount: number,
    prevPage: number,
    nextPage: number,
    totalPage: number,
    currentPage: number,
    search?: SearchType
};

type PageDataType = {
    pageNumbers: number[],
    prev: boolean,
    next: boolean,
    totalCount: number,
    prevPage: number,
    nextPage: number,
    totalPage: number,
    currentPage: number,
    search: SearchType
}

// PgaeDTO에 담겨있는 cotents (AskResponseDTO)
type AskItem = {
    id: number,
    memberId: number,
    title: string,
    author: string,
    content: string,
    viewCount: number,
    createdAt: Date,
    updatedAt: Date
};

// 검색 조건
type SearchType = {
    title: string,
    author: string
};

type PageParams = {
    page: number,
    size?: number,
    title?: string,
    author?: string
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    try {
        const {query} = context;
        // 쿼리에서 api 파라미터 추출 및 기본값 설정
        const page = query.page ? parseInt(query.page as string) : 1;
        const title = typeof query.title === 'string' ? query.title : '';
        const author = typeof query.author === 'string' ? query.author : '';

        const PageParams: PageParams = {
            page,
            title,
            author
        };

        const serverData = await getAskList(PageParams)

        console.log("응답 데이터" + serverData)

        return {
            props: {
                serverData
            }
        }
    } catch (err) {
        console.log("에러 발생 : ", err);
        return {
            notFound: true,
        };
    }
};

export default function AskPostHome({serverData}: Props) {
    const {moveToAskList} = useCustomMove();

    const pageData: PageDataType = {
        pageNumbers: serverData.pageNumbers,
        prev: serverData.prev,
        next: serverData.next,
        totalCount: serverData.totalCount,
        prevPage: serverData.prevPage,
        nextPage: serverData.nextPage,
        totalPage: serverData.totalPage,
        currentPage: serverData.currentPage,
        search: serverData.search ?? {title: '', author: ''}
    };

    return (
        <div className="custom-MainContainer mt-4">
            <h3 className="mb-4 fw-bold text-center">질문 게시판</h3>

            <table className="table table-bordered table-hover text-center">
                <thead className="table-primary">
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
                </thead>
                <tbody>
                {serverData?.contents?.map((post) => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td className="text-start">
                            <Link href={`/asks/${post.id}`} className="text-decoration-none text-dark">
                                {post.title}
                            </Link>
                        </td>
                        <td>{post.author}</td>
                        <td>{new Date(post.createdAt).toISOString().slice(0, 10)}</td>
                        <td>{post.viewCount}</td>
                    </tr>
                )) || <tr>
                    <td colSpan={5}>게시글이 없습니다.</td>
                </tr>}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <PageComponent pageData={pageData} movePage={moveToAskList}/>
        </div>
    );
}
