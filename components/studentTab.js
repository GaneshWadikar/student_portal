import styles from "/styles/Teacher.module.scss";

import Image from "next/image";
import Link from "next/link";

export default function StudentTab({ data }) {
  return (
    <Link
      href={{
        pathname: "/student",
        query: { urn: data.urn },
      }}
      passHref
    >
      <div className={`tile ${styles.tab}`}>
        <div className={styles.img}>
          <Image
            src={data.profile_pic}
            height={80}
            width={80}
            alt="Profile Photo"
          />
        </div>
        <div className={styles.aside}>
          <div className={styles.top}>{data.name}</div>
          <div className={styles.bottom}>URN: {data.urn}</div>
        </div>
      </div>
    </Link>
  );
}
