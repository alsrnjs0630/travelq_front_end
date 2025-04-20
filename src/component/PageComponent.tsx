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
                    {/*이전 버튼*/}
                    {pageData.prev ? (
                        <li className="page-item disabled"
                        onClick={() => movePage(pageData.prevPage)}>
                            이전
                        </li>
                    ) : null}
                    {/*페이지 번호*/}
                    {pageData.pageNumbers.map((pageNum) => (
                        <li
                            key={pageNum}
                            className={ `page-item ${pageData.currentPage === pageNum ||
                             (location.pathname === "/asks" && pageData.currentPage === 0 && pageNum === 1)} ? active : null`}
                            onClick={() => movePage(pageNum)}>
                            {pageNum}
                        </li>
                    ))}
                    {/*다음 버튼*/}
                    {pageData.next ? (
                        <li className="page-item disabled"
                            onClick={() => movePage(pageData.nextPage)}>
                            다음
                        </li>
                    ) : null}
                </ul>
            </nav>
        </>
    );
}

export default PageComponent;