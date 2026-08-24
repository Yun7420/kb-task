import { useTaskList } from "./hooks";
import { TaskCard } from "./components";
import styles from "./TaskListPage.module.css";

const TaskListPage = () => {
  const { parentRef, tasks, virtualizer, isLoading, isFetchingNextPage } =
    useTaskList();

  if (isLoading) return <div>불러오는 중...</div>;

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
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TaskCard task={tasks[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
      {isFetchingNextPage && <div>더 불러오는 중...</div>}
    </div>
  );
};

export default TaskListPage;
