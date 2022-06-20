import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import axios from "axios";
import { useNotify } from "react-admin";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function InputModal({ open, setOpen }) {
  const notify = useNotify();

  const [textValue, setTextValue] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const fetchDomain = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const { data } = await axios.get("/api/domains/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTextValue(data.map((row) => row["domain_name"]).join("\n"));
    } catch (err) {
      notify(err.response.data.message || err.message);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const domainList = textValue
      .trim()
      .split(/\r?\n/)
      .filter((domain) => domain)
      .map((domain) => domain.trim());

    if (
      !window.confirm(`Are you sure want to save ${domainList.length} domains?`)
    )
      return;

    setSaving(true);

    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      await axios.post(
        "/api/domains/all",
        { data: { domainList } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      notify("Successfully saved");
      fetchDomain();
      setSaving(false);
    } catch (err) {
      notify("Something went wrong");
      setSaving(false);
    }
  };

  React.useEffect(() => {
    fetchDomain();
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} fullWidth={true} open={open}>
      <DialogTitle onClose={handleClose} fetchDomain={fetchDomain}>
        Domain List
      </DialogTitle>
      <DialogContent dividers style={{ overflowY: "hidden" }}>
        <TextField
          style={{ marginTop: 0, marginBottom: 0 }}
          multiline
          required
          rows={20}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Enter one domain per line"
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={saving}
          onClick={onFormSubmit}
          style={{ marginLeft: 8, marginRight: 8 }}
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          Save changes
        </Button>
        <Button
          disabled={saving}
          style={{ marginRight: 8 }}
          color="primary"
          onClick={() => {
            setTextValue("");
            setSaving(false);
          }}
        >
          Clear
        </Button>
        <div style={{ flex: "1 0 0" }} />
      </DialogActions>
    </Dialog>
  );
}
