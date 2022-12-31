import * as tsCheck from "io-ts";
export interface RouteDetails {
    id: string;
    title: string;
    description: string;
    endpoint: string;
    type: string;
    response: string;
}
export enum ResponseStatus {
    Success,
    Failure,
    Pending
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
    page_size: number;
    response: RoutesResponse;
}

export  const RequestType = ["POST","GET","PUT","DELETE","PATCH"];

export class APIResponseErr extends Error {
    serviceCode: number;
    status: ResponseStatus;
    timeStamp?: string;
    constructor(serviceCode: number, status: ResponseStatus, timeStamp?: string, message?: string) {
        super(message)
        this.serviceCode = serviceCode
        this.status = status
        this.timeStamp = timeStamp  
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
    routes: RouteDetails[];
}

export interface ARouteResponse {
    serviceId: number;
    message: string;
    timeStamp: string;
    route: RouteDetails;
}
export enum PathsLink {
    dashboard = "/",
    about = "/about"
}

export const defaultResponse: RoutesResponse  = {
    serviceId: 0,
    message: "",
    timeStamp: "",
    routeCount: 0,
    routes: []
}