import Link from "next/link";

export default function RecommendPostHome() {
    const postList = [
        { id: 1, title: "첫 번째 게시글", writer: "홍길동", date: "2025-04-07", views: 123, likes: 5 },
        { id: 2, title: "두 번째 게시글", writer: "김철수", date: "2025-04-06", views: 98, likes: 3 },
        { id: 3, title: "세 번째 게시글", writer: "이영희", date: "2025-04-05", views: 150, likes: 10 },
        // 여기에 더미 데이터를 더 추가할 수 있어요
    ];

    return (
        <div className="custom-MainContainer mt-4">
            <h3 className="mb-4 fw-bold text-center">추천 게시판</h3>

            <table className="table table-bordered table-hover text-center">
                <thead className="table-primary">
                <tr>
                    <th>번호</th>
                    <th className="text-start">제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                </tr>
                </thead>
                <tbody>
                {postList.map((post) => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td className="text-start">
                            <Link href={`/recommendPost/${post.id}`} className="text-decoration-none text-dark">
                                {post.title}
                            </Link>
                        </td>
                        <td>{post.writer}</td>
                        <td>{post.date}</td>
                        <td>{post.views}</td>
                        <td>{post.likes}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <span className="page-link">이전</span>
                    </li>
                    <li className="page-item active">
                        <Link href="/recommendPost?page=1" className="page-link">1</Link>
                    </li>
                    <li className="page-item">
                        <Link href="/recommendPost?page=2" className="page-link">2</Link>
                    </li>
                    <li className="page-item">
                        <Link href="/recommendPost?page=3" className="page-link">3</Link>
                    </li>
                    <li className="page-item">
                        <Link href="/recommendPost?page=2" className="page-link">다음</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
