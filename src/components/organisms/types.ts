import { ReactNode } from "react";

export type Tabs = {
  [tabName: string]: {
    content: ReactNode;
    tabNumber: number;
    trigger?: ReactNode;
  };
};
