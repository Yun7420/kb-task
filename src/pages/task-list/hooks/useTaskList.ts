import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getTasks } from "../api";

export function useTaskList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
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
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // 무한 스크롤: 끝 근처 도달 시 다음 페이지
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (
      lastItem.index >= tasks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    tasks.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return { parentRef, tasks, virtualizer, isLoading, isFetchingNextPage };
}
