import React, {useState} from "react";
import {GetServerSideProps} from "next";
import {detailRecommendPost, updateRecommendPost} from "@/apis/RecommendApi";
import {useRouter} from "next/router";

type Props = {
    serverData : RecommendItem;
}

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
    createdAt : Date;
    updatedAt : Date;
};

// UpdateDTO
type updateForm = {
    title: string;
    content: string;
    originalImages: string[];
    newImages: File[];
    deletedImages: string[];
}

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

const EditRecommendPost = ({serverData} : Props) => {
    const router = useRouter();
    // 게시글 수정 폼 데이터
    const postInit : updateForm = {
        title : serverData.title,
        content : serverData.content,
        originalImages : serverData.images,
        newImages : [],
        deletedImages : []
    };

    const [ recommendData, setRecommendData ] = useState({...postInit});

    // 기존 이미지명 추출
    const getOriginalImageName = (url: string) => {
        const imageNameWithUUID = url.split('/').pop();
        return imageNameWithUUID?.split('_').slice(1).join('_');
    }

    // 삭제 이미지 url 제거
    const getImageNameFromUrl = (url: string) => {
        return url.split('/').pop()||'';
    }

    // 제목, 내용 수정 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setRecommendData((prev) => ({
            ...prev,
            [name] : value
        }));
    };

    // 새 이미지 등록 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 현재 등록 이미지
        const newImages = e.target.files;
        // 취소 클릭 시
        if (!newImages || newImages.length === 0) return;
        // FileList -> Array 변환
        const newImageArray = Array.from(newImages);
        const existImageArray = Array.from(recommendData.newImages);

        // 이미 등록된 이미지인지 판별
        const isExist = existImageArray.some(existFile =>
            newImageArray.some(newFile => existFile.name === newFile.name && existFile.size === newFile.size))

        if (isExist) {
            return alert("이미 등록된 이미지입니다.");
        }

        setRecommendData((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...newImageArray]
        }));
        console.log("현재 등록 이미지 : ", recommendData.newImages);
    }

    // 기존 이미지 삭제 핸들러
    const handleImageDelete = (deleteIdx : number) => {
        setRecommendData((prev) => {
            const deletedUrl = prev.originalImages[deleteIdx];
            const deletedImage = getImageNameFromUrl(deletedUrl);

            return {
                ...prev,
                originalImages: prev.originalImages.filter((_, idx) => idx !== deleteIdx),
                // 기존 이미지에서 삭제할 이미지
                deletedImages: [...prev.deletedImages, deletedImage],
            };
        });
    }

    // 새 이미지 삭제 핸들러
    const handleNewImageDelete = (deleteIdx: number) => {
        setRecommendData((prev) => ({
            ...prev,
            newImages: prev.newImages.filter((file, idx) => idx !== deleteIdx),
        }));
    }

    // 수정 요청 버튼
    const handleEdit = async (id: number, updateForm: updateForm) => {
        // 제목, 내용이 비어있는 경우 alert 출력
        if (updateForm.title === "" || updateForm.content === "") {
            return alert("제목과 내용을 모두 입력해주세요.")
        }

        console.log("수정 정보 : ", updateForm);

        try {
            const res = await updateRecommendPost(id, updateForm);
            alert(res.message);
            return router.push(`/recommends/${id}`);
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
            <h3 className="mb-4 fw-bold text-center">게시글 수정</h3>

            {/* 게시글 작성 폼 영역 */}
            <div className="mb-3">
                <label htmlFor="postTitle" className="form-label">제목</label>
                <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    name={"title"}
                    value={recommendData.title}
                    placeholder="제목을 입력하세요"
                    onChange={handleChange}
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

            <div className="mb-3 d-flex gap-2 flex-wrap">
                {/* 기존 이미지 미리보기 */}
                {recommendData.originalImages.map((url, idx) => (
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
                            src={url}
                            alt={`original_preview_${idx}`}
                            style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <div style={{fontSize: "small"}}>
                            {getOriginalImageName(url)}
                        </div>
                    </div>
                ))}

                {/* 새 등록 이미지 미리보기 */}
                {recommendData.newImages.map((file, idx) => (
                    <div key={idx} style={{textAlign: "center", position: "relative"}}>
                        <button
                            onClick={() => handleNewImageDelete(idx)}
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
                <label htmlFor="postContent" className="form-label">내용</label>
                <textarea
                    className="form-control"
                    id="postContent"
                    rows={10}
                    name={"content"}
                    value={recommendData.content}
                    placeholder="내용을 입력하세요"
                    onChange={handleChange}
                />
            </div>

            {/* 버튼 영역 */}
            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(serverData.id, recommendData)}
                >
                    작성 완료
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push(`/recommends/${serverData.id}`)}
                >
                    취소
                </button>
            </div>
        </div>
    )
}

export default EditRecommendPost;