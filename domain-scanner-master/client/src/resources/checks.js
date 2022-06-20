import * as React from "react";
import { List, Datagrid, TextField, Pagination } from "react-admin";
import moment from "moment";

const FormatedDateTime = ({ record = {}, source }) => {
  return record[source] && moment(record[source]).isValid()
    ? moment(record[source]).format("D MMM YYYY HH:mm a")
    : "";
};

const CheckPagination = (props) => (
  <Pagination rowsPerPageOptions={[10, 25, 50]} {...props} />
);

export const CheckList = (props) => (
  <List
    {...props}
    empty={false}
    exporter={false}
    sort={{ field: "timestamp", order: "DESC" }}
    perPage={10}
    pagination={<CheckPagination />}
  >
    <Datagrid>
      <FormatedDateTime label="Start Time" source="timestamp" />
      <FormatedDateTime label="End Time" source="end_time" />
      <TextField label="Success Count" source="success_count" />
      <TextField label="Bad Domain Count" source="bad_domain_count" />
      <TextField label="Not Found Count" source="not_found_count" />
      <TextField label="Total Domain" source="total_domain_count" />
    </Datagrid>
  </List>
);
