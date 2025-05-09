import React, {useState} from "react";
import {createMember} from "@/apis/LoginAPI";
import {useRouter} from "next/router";

const Signup = () => {
    // 페이지 이동 함수
    const router = useRouter();
    // 추가 정보 초기 상태
    const initState = {
        name: '',
        email: '',
        nickname: '',
        birthday: '',
        address: ''
    }
    // 회원 정보
    const [ userData, setUserData ] = useState({...initState});
    // 정보 입력 핸들
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // 회원 등록 버튼
    const handleCreateButton = async (e: React.FormEvent) => {
        e.preventDefault(); // 기본 form 제출 방지
        try {
            const res = await createMember(userData);
            alert("회원 가입 성공!!");
            console.log("등록된 회원 정보:", res);
            router.push("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("회원 가입 실패: " + error.message);
                console.error("에러 내용:", error.message);
            } else {
                alert("알 수 없는 에러가 발생했습니다.");
            }
        }
    }

    return (
        <div
            className="custom-container mt-4"
            style={{ width: 700, height: 500 }}
        >
            <h3 className="mb-4 fw-bold text-center">추가 정보 입력</h3>

            <form onSubmit={handleCreateButton}>
                <table className="table table-bordered align-middle">
                    <tbody>
                    <tr>
                        <th style={{ width: "25%" }}>이름</th>
                        <td>
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="이름을 입력하세요"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="이메일을 입력하세요"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>닉네임</th>
                        <td>
                            <input
                                type="text"
                                name="nickname"
                                value={userData.nickname}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="닉네임을 입력하세요"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>생년월일</th>
                        <td>
                            <input
                                type="text"
                                name="birthday"
                                value={userData.birthday}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="(예): 19980630"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>
                            <input
                                type="text"
                                name="address"
                                value={userData.address}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="주소를 입력하세요"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 버튼 영역 */}
                <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        등록
                    </button>
                    <button type="button" className="btn btn-secondary">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
