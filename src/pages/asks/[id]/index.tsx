import {GetServerSideProps} from "next";
import {checkAuth, deleteAsk, detailAsk} from "@/apis/AskApi";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {ApiResponse} from "@/pages/utils/commonInterface";

type Props = {
    serverData : AskItem
};

type AskItem = {
    id: number,
    title: string,
    author: string,
    content: string,
    viewCount: number,
    reportCount: number,
    state: string,
    createdAt: Date,
    updatedAt: Date
};

export const getServerSideProps : GetServerSideProps<Props> = async (context) => {
    try {
        const { id } = context.params || {};
        console.log("현재 게시물 ID : ", id);

        // id 타입 검사 (문자열이 아니면 404 페이지 출력)
        if(typeof id !== 'string') {
            console.log("잘못된 url 접근입니다.")
            return { notFound: true }
        }
        // id 타입 number로 변환
        const postId = parseInt(id, 10);
        if (isNaN(postId)) {
            console.log("잘못된 게시글 아이디입니다.");
            return { notFound: true }
        }
        // api 호출(게시글 상세)
        const serverData = await detailAsk(postId)
        console.log("현재 게시글 정보: ", serverData)
        console.log("게시글 생성일 : ", serverData.createdAt)

        return {
            props: {
                serverData
            }
        }
    } catch (error) {
        console.log("알 수 없는 오류 발생 : ", error)
        return { notFound: true };
    }
}

const DetailAskPost = ({serverData}: Props) => {
    const router = useRouter();
    const postId = serverData.id;
    const loginState = localStorage.getItem("loginState");

    useEffect(() => {
        // @ts-ignore
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, [])

   // 삭제 버튼 핸들러
    const handleDelete = async () => {
        try {
            if (loginState === 'guest' || loginState == null) {
                return alert("로그인이 필요합니다.")
            }

            const res : ApiResponse<unknown | null> = await deleteAsk(postId);
            if (!res.success) {
                // 삭제 권한이 없는 유저인 경우
                return alert(res.message);
            } else {
                // 게시글 작성자가 삭제하는 경우
                alert(res.message);
                return router.push("/asks");
            }
        } catch (error) {
            console.log("알 수 없는 오류 발생 : ", error)
            alert("네트워크 상태를 확인해주세요.");
        }
    }

    // 수정 버튼 핸들러 (수정 페이지로 이동)
    const handleEdit = async () => {
        try {
            if (loginState === 'guest' || loginState == null) {
                return alert("로그인이 필요합니다.")
            }

            const res = await checkAuth(postId);

            // 수정 권한이 없는 경우
            if(!res.success) {
                return alert(res.message);
            } else {
                // 수정 권한이 있는 경우 수정 페이지로 이동
                console.log(res.message);
                return router.push(`/asks/${postId}/edit`);
            }
        } catch (error) {
            if (error instanceof Error) {
                alert("에러 발생 : " + error.message);
                console.error("에러 내용:", error.message);
            } else {
                alert("알 수 없는 에러가 발생했습니다.");
            }
        }
    }

    return(
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
                        <span>
                            작성일: {new Date(serverData.createdAt).toISOString().slice(0, 10)}
                        </span>
                        <span>
                            조회수: {serverData.viewCount}
                        </span>
                    </div>
                </div>

                {/* 목록 테이블 head/body 구분선과 유사한 수평선 */}
                <hr className="mb-4"/>

                <div className="post-content">
                    <p>
                        {serverData.content}
                    </p>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary me-2"
                        onClick={() => router.push("/asks")}>
                    목록
                </button>
                <button className="btn btn-secondary me-2"
                        onClick={() => handleEdit()}>
                    수정
                </button>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#CheckDelete">
                    삭제
                </button>
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
                                    onClick={() => handleDelete()}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailAskPost;