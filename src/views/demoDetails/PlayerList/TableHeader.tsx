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
  },
  playerColumn: {
    width: "50%",
    paddingLeft: "8px",
  },
  classesColumn: {
    flexGrow: 1,
  },
  smallColumn: {
    width: "32px",
    textAlign: "center",
  },
}));

export function TableHeader() {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.playerColumn}>Player</span>
      <span className={classes.classesColumn}>Classes</span>
      <span className={classes.smallColumn}>K</span>
      <span className={classes.smallColumn}>A</span>
      <span className={classes.smallColumn}>D</span>
    </div>
  );
}
