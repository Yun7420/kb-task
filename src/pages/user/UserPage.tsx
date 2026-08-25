import { useUser } from "./hooks";
import styles from "./UserPage.module.css";

const UserPage = () => {
  const { data, isLoading, isError } = useUser();
  if (isLoading) return <div>불러오는 중...</div>;
  if (isError || !data) return <div>회원정보를 불러오지 못했습니다.</div>;

  return (
    <div className={styles.page}>
      <h1>회원정보</h1>
      <div className={styles.row}>
        <span className={styles.label}>이름</span>
        <span className={styles.value}>{data.name}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>메모</span>
        <span className={styles.value}>{data.memo}</span>
      </div>
    </div>
  );
};

export default UserPage;
