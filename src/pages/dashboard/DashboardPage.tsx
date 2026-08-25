import { useDashboard } from "./hooks";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard();
  if (isLoading) return <div>불러오는 중...</div>;
  if (isError || !data) return <div>대시보드를 불러오지 못했습니다.</div>;

  return (
    <div className={styles.page}>
      <h1>대시보드</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.label}>일</span>
          <span className={styles.value}>{data.numOfTask}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>해야할 일</span>
          <span className={styles.value}>{data.numOfRestTask}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>한 일</span>
          <span className={styles.value}>{data.numOfDoneTask}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
