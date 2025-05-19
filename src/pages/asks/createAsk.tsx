import React, {useState} from "react";
import {createAsk} from "@/apis/AskApi";
import {useRouter} from "next/router";

type CreatePost = {
    title : string,
    content : string
};

const CreateAsk = () => {
    const router = useRouter();
    // 폼 데이터
    const initState : CreatePost = {
        title : '',
        content : ''
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
    // api 요청 버튼 핸들러
    const handleCreatePost = async () => {
        // 제목 | 내용이 비었을 경우 경고 출력
        if(askData.title === '' || askData.content === '') {
            return alert("제목과 내용을 모두 입력해주세요");
        }
        try {
            const res = await createAsk(askData);
            console.log("질문 게시글 등록 완료. 게시글 : {}", res.data);
            alert("질문 게시글 등록 완료!");
            router.push("/asks")
        } catch (error) {
            if (error instanceof Error) {
                alert("질문 게시글 등록 실패: " + error.message);
                console.error("게시글 등록 실패. 에러 :", error.message);
            } else {
                alert("알 수 없는 에러가 발생했습니다.");
            }
        }
    }
    // 취소 버튼 핸들러

    return (
        <div className="custom-container mt-4"
            style={{height : 500}}>
            <h3 className="mb-4 fw-bold text-center">게시글 작성</h3>

            {/* 게시글 작성 폼 영역 */}
            <div className="mb-3">
                <label htmlFor="postTitle" className="form-label">제목</label>
                <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    name={"title"}
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
                    placeholder="내용을 입력하세요"
                    onChange={handleChange}
                />
            </div>

            {/* 버튼 영역 */}
            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleCreatePost()}
                >
                    작성 완료
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push("/asks")}
                >
                    취소
                </button>
            </div>
        </div>
    )
};

export default CreateAsk;