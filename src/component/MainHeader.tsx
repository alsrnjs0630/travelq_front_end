import Link from "next/link";
import Image from "next/image";
import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import {RootState} from "@/store/store";
import {loggedIn, loggedOut} from "@/store/loginSlice";
import {useRouter} from "next/router";

const HOST_SERVER = "http://localhost:3000";
const BACKEND_SERVER = "http://localhost:8080";

export default function MainHeader() {
    const router = useRouter();
    const dispatch = useDispatch();
    // 로그인 상태
    const loginValue = useSelector((state: RootState) => state.loginState.value);

    // 로그인 핸들
    const handleLogin = () => {
        dispatch(loggedIn());
        localStorage.setItem("loginState", "auth");
    }
    // 로그아웃 핸들
    const handleLogout = () => {
        dispatch(loggedOut());
        localStorage.removeItem("loginState");
    }

    // OAuth2 로그인 팝업창
    const openOAuth = (provider: string) => {
        window.open(
            `${BACKEND_SERVER}/oauth2/authorization/${provider}`,
            `${provider}login`,
            "width=500, height=700, left=400, top=100"
        )
    }

    useEffect(() => {
        // 로그인상태 유지
        const savedLoginState = localStorage.getItem("loginState");
        if (savedLoginState === "auth") {
            dispatch(loggedIn());
        }
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "http://localhost:8080")
                return;
            if (event.data === "LOGIN_SUCCESS") {
                // 로그인 상태 변경
                handleLogin();
                console.log("로그인 성공! 메인 페이지로 이동");
                // window.location.href = "/";
                router.push("/");
            } else if (event.data === "NEED_MORE_INFO") {
                console.log("추가 정보 입력 필요 페이지로 이동");
                // window.location.href = "/login/signup";
                router.push("/login/signup")
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
            {/* 로고 영역 */}
            <div className="custom-container m-auto text-center pt-2">
                <Link href={HOST_SERVER}>
                    <Image
                        src="/travelq-logo.png"
                        alt="로고"
                        width={200}
                        height={200}
                    />
                </Link>
            </div>

            {/* nav 영역 */}
            <div
                style={{
                    backgroundColor: "#0203fd",
                    width: "100%",
                    height: "40px",
                }}
            >
                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "white",
                        maxWidth: "1080px",
                        margin: "0 auto",
                        height: "100%",
                        fontWeight: "bold",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                    }}
                >
                    {/* 왼쪽 메뉴 */}
                    <div style={{display: "flex", gap: "30px"}}>
                        <Link href="/recommendPost" className="nav-link-hover">
                            추천 게시판
                        </Link>
                        <Link href="/asks" className="nav-link-hover">
                            질문 게시판
                        </Link>
                        <Link href={HOST_SERVER} className="nav-link-hover">
                            공지사항
                        </Link>
                    </div>

                    {/* 오른쪽 로그인 */}
                    <div>
                        {loginValue === "guest" ?
                            <div className="dropdown" style={{position: 'relative', display: 'inline-block'}}>
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="loginDropdownButton"
                                    aria-expanded="false"
                                    style={{
                                        backgroundColor: "#0203fd",
                                        borderColor: "#0203fd",
                                        color: "#ffffff",
                                        fontWeight: "bold"
                                    }}
                                >
                                    로그인
                                </button>

                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="loginDropdownButton"
                                >
                                    <li>
                                        <button className={"mb-2"} onClick={() => openOAuth("google")}>
                                            <Image src="/GoogleLoginImage.png" alt={"구글 로그인"} width={200} height={40}/>
                                        </button>
                                    </li>
                                    <li>
                                        <button className={"mb-2"} onClick={() => openOAuth("kakao")}>
                                            <Image src="/KakaoLoginImage.png" alt={"카카오 로그인"} width={200} height={40}/>
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => openOAuth("naver")}>
                                            <Image src="/NaverLoginImage.png" alt={"네이버 로그인"} width={200} height={40}/>
                                        </button>
                                    </li>
                                </ul>

                                <style jsx>{`
                                    .dropdown:hover .dropdown-menu {
                                        display: block;
                                        margin-top: 0;
                                    }
                                `}</style>
                            </div>
                            :
                            <button
                                className="btn btn-primary"
                                type="button"
                                id="logoutButton"
                                onClick={() => handleLogout()}
                                aria-expanded="false"
                                style={{
                                    backgroundColor: "#0203fd",
                                    borderColor: "#0203fd",
                                    color: "#ffffff",
                                    fontWeight: "bold"
                                }}
                            >
                                로그아웃
                            </button>
                        }
                    </div>
                </nav>
            </div>
        </>
    );
}
