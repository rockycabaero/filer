import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { green, red } from "@material-ui/core/colors";
import axios from "axios";

import {
  List,
  Create,
  Edit,
  Datagrid,
  SimpleForm,
  TextInput,
  TopToolbar,
  CreateButton,
  Pagination,
} from "react-admin";

const MyUrlField = ({ record = {}, source }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={record[source]}
    onClick={(e) => e.stopPropagation()}
  >
    {record[source]}
  </a>
);

const ServerTestField = ({ record = {}, source }) => {
  const [checking, setChecking] = React.useState(true);
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    axios
      .post("/api/isLive/", {
        serverUrl: record[source],
      })
      .then(() => setIsLive(true))
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return <CircularProgress size="1rem" />;
  }

  return isLive ? (
    <CheckCircleIcon style={{ color: green[500], fontSize: "1rem" }} />
  ) : (
    <ErrorIcon style={{ color: red[500], fontSize: "1rem" }} />
  );
};

const ServerListActions = ({ basePath }) => (
  <TopToolbar>
    <CreateButton label="Add Server" basePath={basePath} />
  </TopToolbar>
);

const ServerPagination = (props) => (
  <Pagination rowsPerPageOptions={[50, 100, 250]} {...props} />
);

export const ServerList = (props) => (
  <List
    {...props}
    empty={false}
    sort={{ field: "server_name", order: "ASC" }}
    perPage={50}
    pagination={<ServerPagination />}
    actions={<ServerListActions />}
  >
    <Datagrid rowClick="edit">
      <MyUrlField label="Server Name" source="server_name" />
      <ServerTestField label="Live" source="server_name" sortable={false} />
    </Datagrid>
  </List>
);

export const ServerEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Server Name" source="server_name" fullWidth />
    </SimpleForm>
  </Edit>
);

export const ServerCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Server Name" source="server_name" fullWidth />
    </SimpleForm>
  </Create>
);
