import { useTaskList } from "./hooks";
import { TaskCard } from "./components";
import styles from "./TaskListPage.module.css";

const TaskListPage = () => {
  const {
    parentRef,
    tasks,
    virtualizer,
    isLoading,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
  } = useTaskList();

  if (isLoading) return <div>불러오는 중...</div>;
  // 다음 페이지 실패로 이미 불러온 목록까지 감추지 않는다
  if (isError && tasks.length === 0)
    return <div>할 일 목록을 불러오지 못했습니다.</div>;

  if (tasks.length === 0) {
    return (
      <div>
        <h1>할 일 목록</h1>
        <p>등록된 할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>할 일 목록</h1>
      <div ref={parentRef} className={styles.scrollArea}>
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                paddingBottom: "12px",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TaskCard task={tasks[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
      {isFetchingNextPage && <div>더 불러오는 중...</div>}
      {isFetchNextPageError && <p>다음 목록을 불러오지 못했습니다.</p>}
    </div>
  );
};

export default TaskListPage;
