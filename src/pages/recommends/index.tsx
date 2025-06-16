import Link from "next/link";
import {GetServerSideProps} from "next";
import {getRecommendList} from "@/apis/RecommendApi";
import {useRouter} from "next/router";
import useCustomMove from "@/hooks/useCustomMove";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect, useState} from "react";
import PageComponent from "@/component/PageComponent";

type Props = {
    serverData : RcmPageData;
}

// PageDTO 응답 결과
type RcmPageData = {
    contents: RecommendItem[],
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

// Pageable
type PageDataType = {
    pageNumbers: number[];
    prev: boolean;
    next: boolean;
    totalCount: number;
    prevPage: number;
    nextPage: number;
    totalPage: number;
    currentPage: number;
    search: SearchType;
}

// RcmResponseDTO
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
    title : string;
    author : string;
}

// api 파라미터
type PageParams = {
    page: number,
    size?: number,
    title?: string,
    author?: string
};

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

        const serverData = await getRecommendList(PageParams)

        console.log("응답 데이터" + serverData)

        return {
            props: {
                serverData
            }
        }
    } catch (err) {
        console.log("에러 발생 : ", err);
        return {notFound: true};
    }
};

export default function RecommendPostHome({serverData} : Props) {
    const router = useRouter();
    const { moveToRecommendList } = useCustomMove();
    const loginState = useSelector((state: RootState) => state.loginState.value);

    // 상태 필드
    const [searchType, setSearchType] = useState<string>('title');
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchAuthor, setSearchAuthor] = useState<string>("");

    // 검색 버튼 동작 함수
    const handleSearch = () => {
        router.push({
            pathname: '/recommends',
            query: {
                page: serverData.currentPage,
                title: searchTitle,
                author: searchAuthor
            }
        });
    }

    // 글쓰기 버튼
    const handleWritePost = () => {
        if (loginState === 'auth') {
            router.push('/recommends/createPost');
        } else {
            alert('로그인이 필요한 기능입니다!');
        }
    }

    // 질문 게시판 페이지 데이터
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
        if (searchType === 'title') {
            setSearchAuthor('');
        } else if (searchType === 'author') {
            setSearchTitle('')
        }
    }, [searchType])

    return (
        <div className="custom-MainContainer mt-4">
            <h3 className="mb-4 fw-bold text-center">추천 게시판</h3>

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
                    onChange={(e) => {
                        if (searchType === 'title') {
                            setSearchTitle(e.target.value);
                        } else {
                            setSearchAuthor(e.target.value);
                        }
                    }}
                />

                <button className="btn btn-primary" onClick={handleSearch}>
                    검색
                </button>
                <button className="btn btn-primary ms-2"
                        onClick={() => handleWritePost()}>
                    글쓰기
                </button>
            </div>

            <table className="table table-bordered table-hover text-center">
                <thead className="table-primary">
                <tr>
                    <th>번호</th>
                    <th className="text-start">제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                </tr>
                </thead>
                {/* 게시글 상태 "정상(NORMAL)" && 신고 수 10 미만인 게시글만 출력 */}
                <tbody>
                {(() => {
                    const fileredPost = serverData.contents.filter(post => post.state === "NORMAL" && post.reportCount <= 10)
                    return fileredPost.length > 0 ? (
                        fileredPost.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td className="text-start">
                                    <Link href={`/recommends/${post.id}`} className="text-decoration-none text-dark">
                                        {post.title}
                                    </Link>
                                </td>
                                <td>{post.author}</td>
                                <td>{new Date(post.createdAt).toISOString().slice(0, 10)}</td>
                                <td>{post.viewCount}</td>
                                <td>{post.likeCount}</td>
                            </tr>
                        ))
                    ) :
                    <tr>
                        <td colSpan={5}>게시글이 없습니다.</td>
                    </tr>
                })()}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <nav aria-label="Page navigation">
                <PageComponent pageData={pageData} movePage={moveToRecommendList}/>
            </nav>
        </div>
    );
}
