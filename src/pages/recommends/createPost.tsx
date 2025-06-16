import React, {useState} from "react";
import {useRouter} from "next/router";
import {createRecommendPost} from "@/apis/RecommendApi";

type RecommendPost = {
    title: string;
    content: string;
    images: File[];
}

export const CreatePost = () => {
    const router = useRouter();

    // 게시글 데이터 초기화
    const postInit : RecommendPost = {
        title: '',
        content: '',
        images: [],
    }
    const [recommendData, setRecommendData] = useState({...postInit});

    // 게시글 작성 변화 감지 핸들러
    const handleChangePost = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setRecommendData((prev) => ({
            ...prev,
            [name] : value,
        }))
    };

    // 이미지 등록 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 현재 등록 이미지
        const newImages = e.target.files;
        // 취소 클릭 시
        if (!newImages || newImages.length === 0) return;
        // FileList -> Array 변환
        const newImageArray = Array.from(newImages);
        const existImageArray = Array.from(recommendData.images);

        // 이미 등록된 이미지인지 판별
        const isExist = existImageArray.some(existFile =>
            newImageArray.some(newFile => existFile.name === newFile.name && existFile.size === newFile.size))

        if (isExist) {
            return alert("이미 등록된 이미지입니다.");
        }

        setRecommendData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImageArray] // ... : 배열 평탄화 기능. 사용하지 않으면 중첩 배열로 저장돼서 오류 발생
        }));
        console.log("현재 등록 이미지 : ", recommendData.images);
    }

    // 이미지 삭제 핸들러
    const handleImageDelete = (deleteIdx: number) => {
        setRecommendData((prev) => ({
            ...prev,
            images: prev.images.filter((file, idx) => idx !== deleteIdx),
        }));
    };

    // 작성 완료 핸들러
    const handleCreatePost = async () => {
        console.log("등록 요청 게시글 : ", recommendData)
        // 제목, 내용이 비어있는 경우 alert 출력
        if (recommendData.title === "" || recommendData.content === "") {
            return alert("제목과 내용을 모두 입력해주세요.")
        }

        // api 요청
        try {
            const res = await createRecommendPost(recommendData);
            alert(res.message);

            return router.push("/recommends")
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Maximum upload size exceeded") {
                    alert("이미지 파일 용량은 1MB을 넘을 수 없습니다!");
                } else {
                    alert("추천 게시글 등록 실패: " + error.message);
                }
                console.error("게시글 등록 실패. 에러 :", error.message);
            } else {
                alert("알 수 없는 에러가 발생했습니다.");
            }
        }
    }

    return (
        <div className="custom-container mt-4">
            <h3 className="mb-4 fw-bold text-center">게시글 작성</h3>

            {/* 게시글 작성 폼 영역 */}
            <div className="mb-3">
                <label className="form-label fw-bold">제목</label>
                <input
                    type="text"
                    className="form-control"
                    name={"title"}
                    placeholder="제목을 입력하세요"
                    onChange={handleChangePost}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">이미지 등록</label>
                <input
                    type="file"
                    className="form-control"
                    multiple
                    name={"images"}
                    onChange={handleImageChange}
                />
            </div>

            {/* 등록 이미지 미리보기 */}
            <div className="mb-3 d-flex gap-2 flex-wrap">
                {recommendData.images.map((file, idx) => (
                    <div key={idx} style={{textAlign: "center", position: "relative"}}>
                        <button
                            onClick={() => handleImageDelete(idx)}
                            type="button"
                            style={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                lineHeight: "20px",
                                padding: 0,
                            }}
                        >
                            ×
                        </button>
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview_${idx}`}
                            style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <div style={{fontSize: "small"}}>
                            {file.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">내용</label>
                <textarea
                    className="form-control"
                    rows={10}
                    name={"content"}
                    placeholder="내용을 입력하세요"
                    onChange={handleChangePost}
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
                    onClick={() => router.push("/recommends")}
                >
                    취소
                </button>
            </div>
        </div>
    )
}

export default CreatePost;