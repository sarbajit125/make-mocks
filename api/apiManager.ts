import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  ApiErrSchema,
  APIResponseErr,
  AuthReqSchema,
  DomainDTO,
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
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3000/"
    })
  }
  public static sharedInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }
  //http://localhost:3000/mocks
  queryUrl = process.env.middilewareURL ?? "";
  authUrl = "";
  async getAllRoutes(
    page_number: number,
    page_size: number
  ): Promise<RoutesResponse> {
    try {
      const response = await this.axiosInstance.get<RoutesResponse>('mocks', {
        params: {
          page: page_number,
          size: page_size,
          domain: 'mfs'
        },
      });
      if (response.status == 200) {
        return Promise.resolve(response.data as RoutesResponse);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }
  async deleteRoute(id: string): Promise<SuccessResponse> {
    try {
      const response = await this.axiosInstance.delete<SuccessResponse>('mocks', {
        params: { id: id },
      });
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
  async createRoute(routeObj: RouteDetails): Promise<SuccessResponse> {
    try {
      const response = await this.axiosInstance.post<SuccessResponse>(
        'mocks',
        routeObj
      );
      if (response.status == 201) {
        return Promise.resolve(response.data as SuccessResponse);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
    } catch (error) {
      throw this.handleCatchedError(error);
    }
  }

  async updateRoute(routeOj: RouteDetails): Promise<SuccessResponse> {
    try {
      const response = await this.axiosInstance.put<SuccessResponse>('mocks', routeOj);
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

  async fetchTheRoute(id: String, token: String): Promise<RouteDetails> {
    try {
      const response = await this.axiosInstance.get(`mocks/${id}`, {
      });
      if (response.status == 200) {
        return Promise.resolve(response.data.route as RouteDetails);
      } else {
        const errObj = this.handleInvalidHttp(response);
        return Promise.reject(errObj);
      }
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
   fetechAllDomains () {
    return this.axiosInstance.get<DomainDTO[]>('domains').then((response) => response.data)
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
