import { UUID } from "crypto";

export type ResponseType = {
  message: string;
  data?: DataResponse | string[];
  token?: string;
  validationToken?: string;
  code?: string;
};

export type DataResponse = {
  deudas?: Deudas;
  itemsList?: ItemListItem[];
};

export type Deudas = {
  [persona: string]: {
    [moroso: string]: number;
  };
};

export type ItemListItem = {
  uuid: UUID;
  title: string;
  payer: string;
  amount: number;
  debtors: string[];
  createdAt: Date;
};

export type ItemBody = {
  title: string;
  payer: string;
  amount: number;
  debtors: string[];
}