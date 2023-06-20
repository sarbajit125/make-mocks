import { NavItemsList } from "../components/navbar";
export interface RouteDetails {
  id: string;
  title: string;
  endpoint: string;
  type: string;
  response: string;
  statusCode: number;
  headers?: HeaderTableModel[];
  domain: string;
}
export enum ResponseStatus {
  Success,
  Failure,
  Pending,
}
export interface CustomHeaders {
  key: string;
  value: string;
}

export interface HeadersResponse {
  serviceCode: number,
  timeStamp: string;
  rows: HeaderTableModel[]
}

export interface ResponseStruct extends SuccessResponse {
  status: ResponseStatus;
}
export interface SuccessResponse {
  serviceCode: number;
  message: string;
  timeStamp: string;
}

export interface ListProps {
  response: RoutesResponse;
}

export const RequestType = ["POST", "GET", "PUT", "DELETE", "PATCH"];

export class APIResponseErr extends Error {
  serviceCode: number;
  status: ResponseStatus;
  timeStamp?: string;
  constructor(
    serviceCode: number,
    status: ResponseStatus,
    timeStamp?: string,
    message?: string
  ) {
    super(message);
    this.serviceCode = serviceCode;
    this.status = status;
    this.timeStamp = timeStamp;
  }
}
export interface ApiErrSchema {
  serviceCode: number;
  status: ResponseStatus;
  timeStamp?: string;
  message: string;
}

export interface RoutesResponse {
  serviceId: number;
  message: string;
  timeStamp: string;
  routeCount: number;
  domain: string;
  routes: RouteDetails[];
}

export interface ARouteResponse {
  serviceId: number;
  message: string;
  timeStamp: string;
  route: RouteDetails;
}

export const defaultResponse: RoutesResponse = {
  serviceId: 0,
  message: "",
  timeStamp: "",
  routeCount: 0,
  domain: "",
  routes: [],
};

export const ExternalNavItems: NavItemsList[] = [
  {
    name: "PrettyJSON",
    navlink: "https://codebeautify.org/jsonviewer",
    isExternal: true,
  },
  { name: "ValidateJSON", navlink: "https://jsonlint.com/", isExternal: true },
  {
    name: "JSONGenerator",
    navlink: "https://json-generator.com/",
    isExternal: true,
  },
];

export interface LoginReqSchema {
  username: string;
  password: string;
}

export interface LoginSuccessResponse {
  authToken: string;
  status: number;
  userId: string;
  username: string;
}

export interface AuthReqSchema extends LoginReqSchema {
  userId: string;
}
export interface DomainDTO {
  id: string;
  name: string;
  desc: string;
}
export interface HTTPStatus {
  name: string;
  code: number;
}

export const HTTPStatusList: HTTPStatus[] = [
  { code: 200, name: "SUCCESS" },
  { code: 201, name: "CREATED" },
  { code: 400, name: "BADREQUEST" },
  { code: 500, name: "INTERNAL SERVER ERROR" },
];

export interface HeaderTableModel extends CustomHeaders {
  id: string,
}
export interface CreateDomainReq {
  id: string,
  name: string,
  desc?: string
}
