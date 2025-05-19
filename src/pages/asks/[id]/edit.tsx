import {useRouter} from "next/router";
import React, {useState} from "react";
import {detailAsk, updateAsk} from "@/apis/AskApi";
import {GetServerSideProps} from "next";

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

type EditPost = {
    title : string,
    content : string
};

// 게시글 상세 데이터
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

const EditAsk = ({ serverData }: Props) => {
    const router = useRouter();
    // 폼 데이터
    const initState : EditPost = {
        title : serverData.title,
        content : serverData.content
    };
    const [ askData, setAskData ] = useState({...initState});

    // 텍스트 필드 변경 감지 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setAskData((prev) => ({
            ...prev,
            [name] : value,
        }))
    };

    // 작성 완료 (수정 완료) 버튼 핸들러
    const handleEdit = async () => {
        try {
            const res = await updateAsk(serverData.id, askData);
            alert(res.message);
            return router.push(`/asks/${serverData.id}`)
        } catch (error) {
            if (error instanceof Error) {
                alert("게시글 수정 실패: " + error.message);
                console.error("에러 내용:", error.message);
            } else {
                alert("알 수 없는 에러가 발생했습니다.");
            }
        }
    }

    return (
        <div className="custom-container mt-4"
             style={{height : 500}}>
            <h3 className="mb-4 fw-bold text-center">게시글 수정</h3>

            {/* 게시글 작성 폼 영역 */}
            <div className="mb-3">
                <label htmlFor="postTitle" className="form-label">제목</label>
                <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    name={"title"}
                    value={askData.title}
                    placeholder="제목을 입력하세요"
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="postContent" className="form-label">내용</label>
                <textarea
                    className="form-control"
                    id="postContent"
                    rows={10}
                    name={"content"}
                    value={askData.content}
                    placeholder="내용을 입력하세요"
                    onChange={handleChange}
                />
            </div>

            {/* 버튼 영역 */}
            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit()}
                >
                    작성 완료
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push(`/asks/${serverData.id}`)}
                >
                    취소
                </button>
            </div>
        </div>
    )
}

export default EditAsk;