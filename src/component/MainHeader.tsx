import Link from "next/link";
import Image from "next/image";

const HOST_SERVER = "http://localhost:3000";

export default function MainHeader() {
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
                        justifyContent: "left",
                        gap: "30px",
                        color: "white",
                        maxWidth: "1080px",
                        margin: "0 auto",
                        height: "100%",
                        fontWeight: "bold",
                        paddingLeft: "20px",
                    }}
                >
                    <Link href="/recommendPost" className="nav-link-hover">
                        추천 게시판
                    </Link>
                    <Link href={"/asks"} className="nav-link-hover">
                        질문 게시판
                    </Link>
                    <Link href={HOST_SERVER} className="nav-link-hover">
                        공지사항
                    </Link>
                </nav>
            </div>
        </>
    );
}
