import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    width: "50%",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    lineHeight: 1,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    paddingRight: 8,
  },
  playerColumn: {
    // width: "50%",
    flexGrow: 1,
    paddingLeft: "8px",
  },
  classesColumn: {
    flexGrow: 1,
  },
  smallColumn: {
    width: "32px",
    textAlign: "right",
  },
}));

export function TableHeader() {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.smallColumn}></span>
      <span className={classes.playerColumn}>Name</span>
      <span className={classes.smallColumn} style={{ width: 40 }}>
        Score
      </span>
      <span className={classes.smallColumn}>K</span>
      <span className={classes.smallColumn}>A</span>
      <span className={classes.smallColumn}>D</span>
    </div>
  );
}
