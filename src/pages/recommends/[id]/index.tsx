import React, {useEffect, useState} from "react";
import {GetServerSideProps} from "next";
import {detailRecommendPost, deleteRecommendPost, updateAuthCheck} from "@/apis/RecommendApi";
import {useRouter} from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import {createRecommendCmt, deleteRecommendCmt, reportRecommendCmt} from "@/apis/RecommendCmtApi";

type Props = {
    serverData : RecommendItem
};

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
};

type RecommendCommentRequest = {
    recommendId: number;
    content: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    try {
        const {id} = context.params || {};
        console.log("현재 게시물 ID : ", id);

        // id 타입 검사 (문자열이 아니면 404 페이지 출력)
        if (typeof id !== 'string') {
            console.log("잘못된 url 접근입니다.")
            return {notFound: true}
        }
        // id 타입 number로 변환 (url 파라미터에서 가져오는 정보라 string으로 되어있음)
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            console.log("잘못된 게시글 아이디입니다.");
            return {notFound: true}
        }
        // api 호출(게시글 상세)
        const serverData = await detailRecommendPost(postId);
        console.log("현재 게시글 정보: ", serverData);

        return {
            props: {
                serverData
            }
        }
    } catch (error) {
        console.log("알 수 없는 오류 발생 : ", error)
        return {notFound: true};
    }
}

const DetailRecommendPost = ({serverData} : Props) => {
    const router = useRouter();
    const postId = serverData.id;
    const loginState = localStorage.getItem("loginState");

    // 댓글 초기화
    const commentInit: RecommendCommentRequest = {
        recommendId: postId,
        content: ''
    };

    // 댓글 state
    const [comment , setComment] = useState({...commentInit});

    // 이미지 슬라이드를 위한 bootstrap 임포트
    useEffect(() => {
        // @ts-ignore
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    // 게시글 수정 권한 확인
    const handleEditAuthCheck = async (id: number) => {
        // 로그인 체크
        if (loginState !== "auth") {
            return alert("로그인이 필요합니다.")
        }

        try {
            const res = await updateAuthCheck(id);

            // 수정 권한 X
            if (!res.success) {
                return alert(res.message);
            }

            // 수정 권한 O - 수정 페이지로 이동
            return router.push(`/recommends/${id}/edit`);

        } catch (error) {
            console.log("수정 권한 확인 중 오류 발생 : ", error);
            return alert("서버 오류 발생. 잠시 후 다시 시도 해 주세요");
        }
    }

    // 게시글 삭제 버튼
    const handlePostDelete = async (id: number) => {
        // 로그인 검사
        const loginState = localStorage.getItem("loginState");
        if (loginState !== "auth" || loginState === null) {
            return alert("로그인이 필요합니다.");
        }
        try {
            const res = await deleteRecommendPost(id);
            alert(res.message);
            return router.push("/recommends");
        } catch (error) {
            console.log("게시글 삭제 오류 : ", error);
            return alert("게시글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    // 댓글 입력 감지
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setComment((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    // 댓글 등록 핸들러
    const handleCreateComment = async () => {
        // 로그인 체크
        if (loginState !== "auth") {
            return alert("로그인이 필요합니다.")
        }

        try {
            const res = await createRecommendCmt(comment);
            return alert(res.message);
        } catch (error) {
            console.log("댓글 작성 중 에러 발생 : ", error);
            return alert("서버 오류 발생. 잠시 후 다시 시도해주세요.")
        }
    }

    // 댓글 신고 핸들러
    const handleReportComment =  async (commentId: number) => {
        // 로그인 체크
        if (loginState !== "auth") {
            return alert("로그인이 필요합니다.")
        }

        try {
            const res = await reportRecommendCmt(commentId);
            return alert(res.message);
        } catch (error) {
            console.log("댓글 작성 중 에러 발생 : ", error);
            return alert(error);
        }
    }
    // 댓글 삭제 핸들러
    const handleDeleteComment = async () => {
        // 로그인 체크
        if (loginState !== "auth") {
            return alert("로그인이 필요합니다.")
        }

        try {
            const res = await deleteRecommendCmt(postId);
            return alert(res.message);
        } catch (error) {
            console.log("댓글 작성 중 에러 발생 : ", error);
            return alert("서버 오류 발생. 잠시 후 다시 시도해주세요.")
        }
    }

    return (
        <div className="custom-container mt-4">
            <div className="post-detail-area p-4 border rounded">
                {/* 제목과 메타 정보 영역 */}
                <div className="post-header mb-3">
                    <h1 className="post-title mb-3 fs-4 fw-bold text-start">
                        제목: {serverData.title}
                    </h1>

                    <div className="d-flex justify-content-between align-items-center text-muted fs-6">
                        <span>
                            작성자: {serverData.author}
                        </span>
                        <div className={"ms-auto"}>
                            <span className={"me-4"}>
                                작성일: {serverData.createdAt ? new Date(serverData.createdAt).toISOString().slice(0, 10) : "관리자 작성"}
                            </span>
                            <span>
                                조회수: {serverData.viewCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 목록 테이블 head/body 구분선과 유사한 수평선 */}
                <hr className="mb-4"/>

                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    {/* 인디케이터 */}
                    <div className="carousel-indicators">
                        {serverData.images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    {/* 이미지 */}
                    <div className="carousel-inner">
                        {serverData.images.map((imageUrl, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            >
                                <img
                                    src={imageUrl}
                                    className="d-block w-100"
                                    alt={`Slide ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* 이전/다음 버튼 */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>


                <div className={"d-flex justify-content-between align-items-center"}>
                    <div className="post-content mt-4">
                        <p>
                            {serverData.content}
                        </p>
                    </div>
                    <button type="button" className="btn btn-link ms-auto">
                        신고
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary me-2"
                        onClick={() => router.push("/recommends")}>
                    목록
                </button>
                <button className="btn btn-secondary me-2" onClick={() => handleEditAuthCheck(serverData.id)}>
                    수정
                </button>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#CheckDelete">
                    삭제
                </button>
            </div>

            <hr className="my-5"/>

            {/*댓글 영역*/}
            <div className="comment-section mt-5">
                <h5 className="fw-bold mb-3">댓글</h5>

                {/*댓글 리스트*/}
                <div className="comment-list">
                    {serverData.recommendCmts && serverData.recommendCmts.length > 0 ? (
                        serverData.recommendCmts.map((cmt) => (
                            <div key={cmt.id} className="border rounded p-3 mb-3 bg-light">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span>
                                        작성자: {cmt.author}
                                    </span>
                                    <span className="text-muted fs-6">
                                        {new Date(cmt.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mb-1 fw-bold">
                                    {cmt.state === "DELETED"
                                        ? "🗑 삭제된 댓글입니다"
                                        : cmt.reportCount >= 10
                                            ? "🚨 신고된 댓글입니다"
                                            : cmt.content}
                                </p>
                                <div className="d-flex align-items-center">
                                    <div className="text-muted small">
                                        신고 수: {cmt.reportCount}
                                    </div>
                                    {cmt.reportCount < 10 && cmt.state !== "DELETED" ?
                                        <div className="ms-auto d-flex gap-2">
                                            <button type="button" className="btn btn-link" onClick={() => handleReportComment(cmt.id)}>
                                                신고
                                            </button>
                                            <button type="button" className="btn btn-link" onClick={() => handleDeleteComment()}>
                                                삭제
                                            </button>
                                        </div>
                                        : <div/>
                                    }
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">댓글이 없습니다.</p>
                    )}
                </div>

                {/*댓글 입력창*/}
                <div className="comment-form mt-4">
                    <h6 className="mb-2">댓글 작성</h6>
                    <textarea
                        className="form-control mb-2"
                        rows={3}
                        placeholder="댓글을 입력하세요"
                        name={"content"}
                        onChange={handleCommentChange}
                    />
                    <div className={"text-end"}>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handleCreateComment()}
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>

            {/* 삭제 확인 모달창 */}
            <div className="modal fade" id="CheckDelete" tabIndex={-1} aria-labelledby="checkDelete"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="checkDelete">주의</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            게시글을 삭제하시겠습니까?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                취소
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                    onClick={() => handlePostDelete(serverData.id)}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailRecommendPost;