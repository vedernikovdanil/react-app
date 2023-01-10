function Count(props: { value: number | string; className?: string }) {
  return (
    <span
      className={`text-muted ms-1 ${props.className || ""}`}
    >{`(${props.value})`}</span>
  );
}

export default Count;
