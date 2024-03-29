import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  ApiErrSchema,
  APIResponseErr,
  AuthReqSchema,
  CreateDomainReq,
  DomainDTO,
  HeadersResponse,
  LoginReqSchema,
  LoginSuccessResponse,
  ResponseStatus,
  RouteDetails,
  RoutesResponse,
  SuccessResponse,
} from "../DTO/components";
import Cookies from "js-cookie";
export class APIManager {
  private static instance: APIManager;
  axiosInstance: AxiosInstance;
  private constructor() {
    console.log(process.env.NEXT_PUBLIC_BASE_URL)
    this.axiosInstance = axios.create({
    });
    this.axiosInstance.interceptors.response.use((response) => {
      console.log("Response recived", JSON.stringify(response.data, null, 2));
      return response;
    });
  }
  public static sharedInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }
  getAllRoutes(
    page_number: number,
    page_size: number,
    domain: string
  ): Promise<RoutesResponse> {
    return this.axiosInstance
      .get<RoutesResponse>("/api/fetchAllRoutes", {
        params: {
          page: page_number,
          size: page_size,
          domain: domain,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        } else {
          throw this.handleInvalidHttp(response);
        }
      })
      .catch((error) => {
        throw this.handleCatchedError(error);
      });
  }
  async deleteRoute(id: string): Promise<SuccessResponse> {
    try {
      const response = await this.axiosInstance
        .delete<SuccessResponse>("/api/deleteARoute", {
          params: { id: id },
        });
      return response.data;
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  async createRoute(routeObj: RouteDetails): Promise<SuccessResponse> {
    return this.axiosInstance
      .post<SuccessResponse>("/api/addARoute", routeObj)
      .then((response) => response.data)
      .catch((error) => {
        throw this.handleCatchedError(error);
      });
  }

  async updateRoute(routeOj: RouteDetails): Promise<SuccessResponse> {
    try {
      console.log(routeOj);
      const response = await this.axiosInstance.put<SuccessResponse>(
        "/api/updateARoute",
        routeOj
      );
      if (response.status == 200) {
        return Promise.resolve(response.data as SuccessResponse);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }

  async fetchTheRoute(id: String): Promise<RouteDetails> {
    return this.axiosInstance
      .get(`/mocks/${id}`)
      .then((response) => {
        if (response.status == 200) {
          return Promise.resolve(response.data.route as RouteDetails);
        } else {
          const errObj = this.handleInvalidHttp(response);
          return Promise.reject(errObj);
        }
      })
      .catch((error) => {
        throw this.handleCatchedError(error);
      });
  }
  async fetchRouteheaders(id: string) : Promise<HeadersResponse> {
    try {
      const result = await this.axiosInstance.get<HeadersResponse>('/api/fetchAllHeaders', {
        params:{
          id: id
        }
      })
      return result.data
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }

  async login(loginObj: LoginReqSchema): Promise<LoginSuccessResponse> {
    try {
      const response = await this.axiosInstance.post<LoginSuccessResponse>(
        `auth/login`,
        loginObj
      );
      if (response.status == 201) {
        var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
        Cookies.set("auth", response.data.authToken, {
          expires: inFifteenMinutes,
        });
        return Promise.resolve(response.data);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }

  async register(userObj: AuthReqSchema): Promise<SuccessResponse> {
    try {
      console.log(userObj);
      const response = await this.axiosInstance.post<SuccessResponse>(
        `auth/register`,
        userObj
      );
      if (response.status == 201) {
        return Promise.resolve(response.data);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
    } catch (error) {
      console.log(error);
      throw this.handleCatchedError(error);
    }
  }
  async Logout() {
    try {
      Cookies.remove("auth");
    } catch (error) {
      console.log(error);
    }
  }
  async fetechAllDomains() {
    return this.axiosInstance
      .get<DomainDTO[]>("domains")
      .then((response) => response.data);
  }
  async setAdomain(domainReq: CreateDomainReq) {
    try {
      const response = await this.axiosInstance.post<SuccessResponse>(
        "/api/addADomain",
        domainReq
      );
      return response.data;
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  async backupDomains() {
    try {
      const response = await this.axiosInstance.get("/api/download/domains", {
        responseType:'blob',
      })
      return response.data
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  async backupRoutes(domain: string) {
    try {
      const response = await this.axiosInstance.get("/api/download/routes", {
        responseType:'blob',
        params:{
          domain: domain
        }
      })
      return response.data
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  async deleteDomain(id: string) {
    try {
      const response = await this.axiosInstance.delete<SuccessResponse>(
        "/api/deleteADomain",
        { params: { id: id } }
      );
      return response.data;
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  handleCatchedError(error: unknown): SuccessResponse | Error {
    if (axios.isAxiosError(error) && error.response) {
      const errData = error.response.data as ApiErrSchema;
      throw new APIResponseErr(
        errData.serviceCode,
        ResponseStatus.Failure,
        errData.timeStamp,
        errData.message
      );
    } else {
      console.log(error);
      throw new APIResponseErr(
        400,
        ResponseStatus.Failure,
        undefined,
        "Something went wrong"
      );
    }
  }
  handleInvalidHttp(response: AxiosResponse<any, any>) {
    throw new APIResponseErr(
      response.status,
      ResponseStatus.Failure,
      "",
      "Invalid http code returned"
    );
  }
}
