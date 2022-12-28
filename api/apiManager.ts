import axios, { AxiosError, AxiosResponse } from "axios";
import { ResponseStatus, ResponseStruct, RouteDetails, SuccessResponse } from "../DTO/components";


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
    async getAllRoutes() : Promise<RouteDetails[]> {
        try {
            const response = await axios.get<RouteDetails[]>(this.queryUrl,{
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'User-Agent': '*',
                }
            })
            console.log(response.data)
            if (response.status == 200 ) {
               return Promise.resolve(response.data)
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
            if (response.status == 201) {
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
                return Promise.resolve(response.data as RouteDetails)
            } else {
                const errObj = this.handleInvalidHttp(response)
                // const errObj: SuccessResponse = {
                //     serviceCode: response.status,
                //     message: "Invalid http code returned",
                //     timeStamp: ""
                // }
                 return Promise.reject(errObj)
            }
        } catch (error) {
            throw this.handleCatchedError(error)
        }
    }

    handleCatchedError(error: unknown) : SuccessResponse | Error {
        if (axios.isAxiosError(error)) {
            const errObj: SuccessResponse = {
                serviceCode: error.response?.status ? error.response.status : 400,
                message: error.response?.statusText ? error.response.statusText : "Something went wrong",
                timeStamp: ""
            }
            throw errObj
        } else {
            console.log(error)
            throw new Error("error could not be validated")
        }
    }
    handleInvalidHttp(response: AxiosResponse<any, any>) {
        const errObj: SuccessResponse = {
            serviceCode: response.status,
            message: "Invalid http code returned",
            timeStamp: ""
        }
        return (errObj)
    }
}