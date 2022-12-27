import axios, { AxiosError } from "axios";
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
                const errObj: ResponseStruct = {
                    status: ResponseStatus.Failure,
                    serviceCode: 500,
                    message: "Something went wrong",
                    timeStamp: ""
                }
                return Promise.reject(errObj)
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                const errObj: ResponseStruct = {
                    status: ResponseStatus.Failure,
                    serviceCode:   error.response?.status ? error.response.status : 400 ,
                    message: error.response?.statusText ? error.response.statusText : "Bad request",
                    timeStamp: ""
                }
            } else {
                console.log(error)
            }
        }
    }
    async deleteRoute(id: string) : Promise<SuccessResponse> {
        try {
            const response = await axios.delete<SuccessResponse>(this.queryUrl, {params:{id:id}})
            if (response.status == 201) {
                return Promise.resolve(response.data as SuccessResponse)
            } else {
                const errObj: SuccessResponse = {
                    serviceCode: 500,
                    message: "Something went wrong",
                    timeStamp: ""
                }
                return Promise.reject(errObj)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errObj : SuccessResponse = {
                    serviceCode: error.response?.status ? error.response.status : 400,
                    message: error.response?.statusText ? error.response.statusText : "Bad Request",
                    timeStamp: ""
                }
            } else {
                console.log(error)
                throw new Error()
            }
        }
    }
}