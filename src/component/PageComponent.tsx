import {useRouter} from "next/router";

type PageComponentProps = {
    pageData: PageDataType;
    movePage: (pageParam?: number) => void;
}

type PageDataType = {
    pageNumbers : number[],
    prev : boolean,
    next : boolean,
    totalCount : number,
    prevPage : number,
    nextPage : number,
    totalPage : number
    currentPage : number,
    search : SearchType
};

type SearchType = {
    title : string,
    author : string
};

const PageComponent = ({pageData, movePage} : PageComponentProps) => {
    // 현재 경로 가져오기
    const location = useRouter();

    return (
        <>
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    {/* 이전 버튼 */}
                    <li className={`page-item ${!pageData.prev ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => pageData.prev && movePage(pageData.prevPage)}
                            disabled={!pageData.prev}
                        >
                            이전
                        </button>
                    </li>

                    {/* 페이지 번호 */}
                    {pageData.pageNumbers.map((pageNum) => (
                        <li
                            key={pageNum}
                            className={`page-item ${
                                pageData.currentPage === pageNum ? "active" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={() => movePage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        </li>
                    ))}

                    {/* 다음 버튼 */}
                    <li className={`page-item ${!pageData.next ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => pageData.next && movePage(pageData.nextPage)}
                            disabled={!pageData.next}
                        >
                            다음
                        </button>
                    </li>
                </ul>
            </nav>

        </>
    );
}

export default PageComponent;