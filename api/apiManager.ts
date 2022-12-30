import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiErrSchema, APIResponseErr, ResponseStatus, RouteDetails, RoutesResponse, SuccessResponse } from "../DTO/components";


export class APIManager {
    private static instance: APIManager;
    private constructor() { }
    public static sharedInstance(): APIManager {
        if (!APIManager.instance) {
            APIManager.instance = new APIManager()
        }
        return APIManager.instance;
    }
    queryUrl = "http://localhost:3000/mocks"
    async getAllRoutes(page_number: number, page_size: number) : Promise<RoutesResponse> {
        try {
            const response = await axios.get<RoutesResponse>(this.queryUrl,{
                headers: {
                    Accept: 'application/json, text/plain, */*',
                },
                params:{
                    page: page_number,
                    size: page_size
                }
            })
            if (response.status == 200 ) {           
                return Promise.resolve(response.data as RoutesResponse)
            } else {
                const errObj = this.handleInvalidHttp(response)
                return Promise.reject(errObj)
            }
        } catch (error) {
            throw this.handleCatchedError(error)
        }
    }
    async deleteRoute(id: string) : Promise<SuccessResponse> {
        try {
            const response = await axios.delete<SuccessResponse>(this.queryUrl, {params:{id:id}})
            if (response.status == 200) {
                return Promise.resolve(response.data as SuccessResponse)
            } else {
                const errObj = this.handleInvalidHttp(response)
                return Promise.reject(errObj)
            }
        } catch (error) {
            throw  this.handleCatchedError(error)
        }
    }
    async createRoute(routeObj: RouteDetails) : Promise<SuccessResponse> {
        try {
            const response = await axios.post<SuccessResponse>(this.queryUrl,routeObj)
            if (response.status == 201) {
                return Promise.resolve(response.data as SuccessResponse)
            } else {
                const errObj = this.handleInvalidHttp(response)
                return Promise.reject(errObj)
            }
        } catch (error) {
            throw this.handleCatchedError(error)
        }
    }

    async updateRoute(routeOj:RouteDetails) : Promise<SuccessResponse> {
        try {
            const response = await axios.put<SuccessResponse>(this.queryUrl, routeOj)
            if (response.status == 200) {
                return Promise.resolve(response.data as SuccessResponse)
            } else {
                const errObj = this.handleInvalidHttp(response)
                return Promise.reject(errObj)
            }
        } catch (error) {
          throw  this.handleCatchedError(error)
        }
    }

    async fetchTheRoute(id: String) : Promise<RouteDetails> {
        try {
            const response = await axios.get(`${this.queryUrl}/${id}`)
            if (response.status == 200) {
                return Promise.resolve(response.data.route as RouteDetails)
            } else {
                const errObj = this.handleInvalidHttp(response)
                 return Promise.reject(errObj)
            }
        } catch (error) {
            throw this.handleCatchedError(error)
        }
    }

    handleCatchedError(error: unknown) : SuccessResponse | Error {
        if (axios.isAxiosError(error) && error.response) {
             const errData = error.response.data as ApiErrSchema
             throw new APIResponseErr(errData.serviceCode, ResponseStatus.Failure, errData.timeStamp, errData.message)
        } else {
            console.log(error)
            throw new APIResponseErr(400, ResponseStatus.Failure, undefined, "Something went wrong")
        }
    }
    handleInvalidHttp(response: AxiosResponse<any, any>) {
        throw new APIResponseErr(response.status, ResponseStatus.Failure, "", "Invalid http code returned")
    }
}