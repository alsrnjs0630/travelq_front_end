'use client'
import Link from "next/link";
import PageComponent from "@/component/PageComponent";
import useCustomMove from "@/hooks/useCustomMove";
import {getAskList} from "@/apis/AskApi"
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

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

// PgaeDTO에 담겨있는 contents (AskResponseDTO)
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

// api 파라미터
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
    const router = useRouter();
    const { moveToAskList } = useCustomMove();

    // 상태 필드
    const [searchType, setSearchType] = useState<string>('title');
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchAuthor, setSearchAuthor] = useState<string>("");

    // 검색 버튼 동작 함수
    const handleSearch = () => {
        router.push({
            pathname: '/asks',
            query: {
                page: serverData.currentPage,
                title: searchTitle,
                author: searchAuthor
            }
        });
    }

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

    useEffect(() => {
        if(searchType === 'title') {
            setSearchAuthor('');
        } else if(searchType === 'author') {
            setSearchTitle('')
        }
    }, [searchType])

    return (
        <div className="custom-MainContainer mt-4">
            <h3 className="mb-4 fw-bold text-center">질문 게시판</h3>

            {/* 검색 필드 */}
            <div className="d-flex justify-content-end mb-3">
                <select
                    className="form-select w-auto me-2"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                </select>

                <input
                    type="text"
                    className="form-control w-25 me-2"
                    placeholder="검색어를 입력하세요"
                    value={searchType === 'title' ? searchTitle : searchAuthor}
                    onChange={(e) => {if (searchType === 'title') {
                        setSearchTitle(e.target.value);
                    } else {
                        setSearchAuthor(e.target.value);
                    } }}
                />

                <button className="btn btn-primary" onClick={handleSearch}>
                    검색
                </button>
            </div>

            {/* 데이터 출력 필드 */}
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
