import Link from "next/link";

export default function MainFooter() {
    const HOST_SERVER = "http://localhost:3000/";

    return (
        <div className="text-center py-4">
            {/* 구분선 */}
            <hr className="mx-auto mb-4" style={{ width: '1080px', height: '2px', backgroundColor: '#0203fd', border: 'none' }} />

            {/* 링크 섹션 */}
            <div className="d-flex justify-content-center align-items-center gap-3">
                <Link href={HOST_SERVER} className="text-decoration-none text-dark">사이트소개</Link>
                <div style={{ height: '16px', width: '1px', backgroundColor: '#aaa' }}></div>
                <Link href={HOST_SERVER} className="text-decoration-none text-dark">이용약관</Link>
                <div style={{ height: '16px', width: '1px', backgroundColor: '#aaa' }}></div>
                <Link href={HOST_SERVER} className="text-decoration-none text-dark">개인정보처리방침</Link>
            </div>

            {/* 저작권 */}
            <p className="mt-4 text-muted small">
                Copyright ⓒ 2025 travelq. All rights reserved
            </p>
        </div>
    );
}
