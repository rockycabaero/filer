import * as React from "react";
import axios from "axios";
import moment from "moment";
import {
  List,
  Datagrid,
  TextInput,
  TextField,
  Pagination,
  Filter,
  SelectInput,
  DateInput,
} from "react-admin";

const UrlField = ({ record = {}, source }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`http://${record[source]}`}
    onClick={(e) => e.stopPropagation()}
  >
    {record[source]}
  </a>
);

const FormatedTime = ({ record = {}, source }) => {
  const timestamp = record[source];
  return moment(timestamp).format("hh:mm:ss a");
};

const DetailPagination = (props) => (
  <Pagination rowsPerPageOptions={[100, 500, 1000, 2000, 5000]} {...props} />
);

const DetailFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      label="Select"
      source="select"
      allowEmpty={false}
      choices={[
        { id: "all", name: "All" },
        { id: "active", name: "Active" },
        { id: "deactivated", name: "Deactivated" },
        { id: "blocked", name: "Blocked" },
        { id: "reserved", name: "Reserved" },
        { id: "waiting_list", name: "Waiting List" },
        { id: "available", name: "Available" },
        { id: "delete_date", name: "Delete Date" },
        {
          id: "delete_date_or_available",
          name: "Delete Date Or Available",
        },
        { id: "bad_domain", name: "Bad Domain" },
      ]}
      alwaysOn
    />
    <DateInput label="Date" source="date" alwaysOn />
  </Filter>
);

export const DetailList = (props) => {
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth"));
    axios
      .get("/api/actions/last", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data: { timestamp } }) => {
        if (timestamp) {
          const lastDate = moment(timestamp).format("YYYY-MM-DD");
          setDate(lastDate);
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <List
      exporter={false}
      empty={false}
      {...props}
      filters={<DetailFilter />}
      perPage={100}
      pagination={<DetailPagination />}
      filterDefaultValues={{ select: "all", date }}
      sort={{ field: "timestamp", order: "DESC" }}
      bulkActionButtons={false}
    >
      <Datagrid rowClick="edit">
        <UrlField label="Domain Name" source="domain" />
        <TextField label="Public Domain Status" source="public_domain_status" />
        <TextField label="Created Date" source="createddate" />
        <TextField label="Domain Type" source="domain_type" />
        <TextField label="Paid Until Date" source="paiduntildate" />
        <TextField label="Period Quantity" source="periodqty" />
        <TextField label="Public Delete Date" source="public_deletedate" />
        <TextField label="Status" source="status" />
        <FormatedTime label="Timestamp" source="timestamp" />
      </Datagrid>
    </List>
  );
};
