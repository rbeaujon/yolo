import React from "react";
import { LeftMenu } from "../menu/leftMenu/leftMenu";
import { TopMenu } from "../menu/topMenu/topMenu";
import './dashboard.styles.scss';

export const Dashboard = () => {

return (
  <div>
    <TopMenu title="Dashboard"/>
    <LeftMenu/>
  </div>
)
}