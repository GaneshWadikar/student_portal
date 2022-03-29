import styles from "/styles/Admin.module.scss";

export default function Batch({ teacher, students, teachers, handleClick }) {
  let teacherName;
  if (teachers)
    for (let teacherObj of teachers) {
      if (teacherObj.trn == teacher) {
        teacherName = teacherObj.name;
        break;
      }
    }

  return (
    <div className={styles.card} onClick={() => handleClick(teacher)}>
      <h3>
        {teacher}: {teacherName}
      </h3>
      <p>Total Students: {students.length}</p>
    </div>
  );
}
