import React from "react";

import Grid from "@material-ui/core/Grid";

import FullscreenDialog from "./FullscreenDialog";

type SettingsViewState = {
  open: boolean;
};

export default class SettingsView extends React.Component<
  Readonly<unknown>,
  SettingsViewState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = { open: false };
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  render() {
    const { open } = this.state;
    return (
      <FullscreenDialog
        title="Settings"
        open={open}
        onClose={() => {
          this.setOpen(false);
        }}
      >
        <div>Settings go here...</div>
      </FullscreenDialog>
    );
  }
}
