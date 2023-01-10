import styles from "./InputUpDown.module.css";

function InputUpDown(props: {
  setValue: (value: number) => void;
  max?: boolean;
  min?: boolean;
}) {
  return (
    <div className={styles["wrapper"]}>
      <button
        className={styles["up"]}
        onClick={() => props.setValue(1)}
        disabled={props.max}
      />
      <button
        className={styles["down"]}
        onClick={() => props.setValue(-1)}
        disabled={props.min}
      />
    </div>
  );
}

export default InputUpDown;
