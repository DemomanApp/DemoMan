import classes from "./TableHeader.module.css";

export function TableHeader() {
  return (
    <div className={classes.root}>
      <span className={classes.smallColumn} />
      <span className={classes.playerColumn}>Name</span>
      <span className={classes.scoreColumn}>Score</span>
      <span className={classes.smallColumn}>K</span>
      <span className={classes.smallColumn}>A</span>
      <span className={classes.smallColumn}>D</span>
    </div>
  );
}
