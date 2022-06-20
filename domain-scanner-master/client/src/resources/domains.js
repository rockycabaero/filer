import * as React from "react";
import {
  List,
  Edit,
  Create,
  Datagrid,
  SimpleForm,
  TextInput,
  TextField,
  Pagination,
  Filter,
  TopToolbar,
  CreateButton,
  Button,
  useRefresh,
} from "react-admin";

import InputModal from "../components/InputModal";

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

const DomainPagination = (props) => (
  <Pagination rowsPerPageOptions={[100, 500, 1000, 2000, 5000]} {...props} />
);

const DomainFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn fullWidth />
  </Filter>
);

export const DomainList = (props) => {
  const refresh = useRefresh();

  const [open, setOpen] = React.useState(false);

  const DomainListActions = ({ basePath }) => (
    <TopToolbar>
      <CreateButton label="Add Domain" basePath={basePath} />
      <Button label="Domain list" onClick={() => setOpen(true)} />
    </TopToolbar>
  );

  React.useEffect(() => {
    if (!open) {
      refresh();
    }
  }, [open]);

  return (
    <>
      <InputModal open={open} setOpen={setOpen} />
      <List
        {...props}
        empty={false}
        sort={{ field: "domain_name", order: "ASC" }}
        filters={<DomainFilter />}
        perPage={100}
        pagination={<DomainPagination />}
        actions={<DomainListActions />}
      >
        <Datagrid rowClick="edit">
          <UrlField label="Domain Name" source="domain_name" />
          <TextField label="Domain Rating" source="domain_rating" />
          <TextField label="Domain Refs" source="domain_refs" />
        </Datagrid>
      </List>
    </>
  );
};

export const DomainEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Domain Name" source="domain_name" fullWidth />
      <TextInput label="Domain Rating" source="domain_rating" fullWidth />
      <TextInput label="Domain Refs" source="domain_refs" fullWidth />
    </SimpleForm>
  </Edit>
);

export const DomainCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Domain Name" source="domain_name" fullWidth />
      <TextInput label="Domain Rating" source="domain_rating" fullWidth />
      <TextInput label="Domain Refs" source="domain_refs" fullWidth />
    </SimpleForm>
  </Create>
);
