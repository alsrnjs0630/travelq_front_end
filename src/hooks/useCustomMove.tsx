import {useRouter} from "next/router";
import {useMemo} from "react";

type QueryType = {
    page: number;
    size?: number;
    title?: string;
    author?: string;
};

const useCustomMove = () => {
    const router = useRouter();
    const {page, size} = router.query;

    // 입력되는 값이 없을 경우 디폴트값 설정
    const getNum = (param: string | string[] | undefined, defaultValue: number) => {
        if (!param) return defaultValue;
        // param이 string[]으로 들어온다면 첫번째 요소 사용
        param = Array.isArray(param) ? param[0] : param;

        const parsed = parseInt(param);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    // 현재 페이지
    const currentPage = getNum(page, 0);
    // 현재 페이지 사이즈
    const pageSize = getNum(size, 10);
    // 현재 페이지와 사이즈를 이용한 디폴트 쿼리
    const queryDefault = useMemo(() => {
        return {
            page: currentPage,
            size: pageSize
        }
    }, [currentPage, pageSize]);

    // 목록 페이지 이동 함수
    const moveToList = (pathname: string, pageParam?: number) => {
        const currentQuery = {...router.query}; // 현재 쿼리

        // pageParam이 number타입으로 존재 할 때
        if (typeof pageParam === 'number') {
            const updatedQuery : QueryType = {
                ...currentQuery,
                page: pageParam
            };
            if (pageSize !== 10) updatedQuery.size = pageSize;

            router.push({
                pathname: pathname,
                query: updatedQuery
            });
        } else {
            router.push({
                pathname: pathname,
                query: queryDefault
            });
        }
    }

    // 질문 게시판 목록 페이지 이동 함수
    const moveToAskList = (pageParam?: number) => {
        moveToList("/asks", pageParam);
    }

    // 추천 게시판 목록 페이지 이동 함수
    const moveToRecommendList = (pageParam?: number) => {
        moveToList("/recommends", pageParam);
    };

    return {moveToAskList, moveToRecommendList, currentPage, pageSize, queryDefault};
}

export default useCustomMove;