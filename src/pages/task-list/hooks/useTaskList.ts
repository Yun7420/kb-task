import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getTasks } from "../api";

export function useTaskList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: ({ pageParam }) => getTasks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNext ? allPages.length + 1 : undefined,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const tasks = data?.pages.flatMap((page) => page.data) ?? [];

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // 무한 스크롤: 끝 근처 도달 시 다음 페이지
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (
      lastItem.index >= tasks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage &&
      // 실패해도 hasNextPage는 true로 남아, 막지 않으면 같은 요청을 무한히 반복한다
      !isFetchNextPageError
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    tasks.length,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  return {
    parentRef,
    tasks,
    virtualizer,
    isLoading,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
  };
}
