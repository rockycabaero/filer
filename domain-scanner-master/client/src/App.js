import React from "react";

import { Admin, Resource } from "react-admin";

import PublicIcon from "@material-ui/icons/Public";
import DnsIcon from "@material-ui/icons/Dns";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ViewListIcon from "@material-ui/icons/ViewList";

import dataProvider from "./providers/data";
import authProvider from "./providers/auth";

import { ServerList, ServerEdit, ServerCreate } from "./resources/servers";
import { DomainList, DomainEdit, DomainCreate } from "./resources/domains";
import { DetailList } from "./resources/details";
import { CheckList } from "./resources/checks";

import Dashboard from "./Dashboard";

function App() {
  return (
    <Admin
      title="Domain Name App"
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
    >
      <Resource
        name="domains"
        icon={PublicIcon}
        list={DomainList}
        edit={DomainEdit}
        create={DomainCreate}
        options={{ label: "Domains" }}
      />
      <Resource
        icon={DnsIcon}
        name="servers"
        list={ServerList}
        edit={ServerEdit}
        create={ServerCreate}
        options={{ label: "Servers" }}
      />
      <Resource
        icon={CheckBoxIcon}
        name="checks"
        list={CheckList}
        options={{ label: "Checks" }}
      />
      <Resource
        icon={ViewListIcon}
        name="details"
        list={DetailList}
        options={{ label: "Details" }}
      />
    </Admin>
  );
}

export default App;
