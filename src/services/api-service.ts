import axios, { AxiosError, AxiosResponse } from "axios";
import { ACError, RequestHeader, ServerError } from "../types/shared";

class ApiService {
  _endpoint: string;

  constructor(endpoint: string) {
    this._endpoint = endpoint;
  }

  get token() {
    return localStorage.getItem("access_token");
  }

  get headers() {
    const headers: RequestHeader = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  resetToken() {
    window.localStorage.removeItem("access_token");
  }

  handleError(error: AxiosError): Promise<ServerError> {
    const serverError = {
      message: error.message,
      status: error.response?.status,
    };

    if (error.response && error.response.data) {
      const errorObj = error.response.data as { error?: ServerError };

      if (errorObj.error) {
        if (errorObj.error.message) {
          return Promise.reject({
            ...serverError,
            message: errorObj?.error?.message,
          });
        }

        return Promise.reject({
          ...serverError,
          message: "Something went wrong.",
        });
      }
    }

    return Promise.reject(serverError);
  }

  checkResponseForErrors(
    response: AxiosResponse
  ): Promise<AxiosResponse | ServerError> {
    if (response.data && response.data.errors) {
      const errorObj = response.data.errors as { errors?: ACError };

      if (errorObj.errors) {
        if (errorObj.errors.systemErrorMessage) {
          return Promise.reject({
            message: errorObj.errors.systemErrorMessage,
          });
        }

        return Promise.reject({
          message: "Something went wrong.",
        });
      }
    }

    return Promise.resolve(response.data);
  }

  async post(url: string, body: unknown) {
    try {
      const response: AxiosResponse = await axios({
        url: `${this._endpoint}${url}`,
        method: "post",
        data: JSON.stringify(body),
        headers: this.headers,
        responseType: "json",
      });

      return this.checkResponseForErrors(response);
    } catch (err) {
      return this.handleError(err as AxiosError);
    }
  }

  async put(url: string, body: unknown) {
    try {
      const response: AxiosResponse = await axios({
        url: `${this._endpoint}${url}`,
        method: "put",
        data: JSON.stringify(body),
        headers: this.headers,
        responseType: "json",
      });

      return response.data;
    } catch (err) {
      return this.handleError(err as AxiosError);
    }
  }

  async get(url: string) {
    try {
      const response: AxiosResponse = await axios({
        url: `${this._endpoint}${url}`,
        method: "get",
        headers: this.headers,
        responseType: "json",
      });

      return response.data;
    } catch (err) {
      return this.handleError(err as AxiosError);
    }
  }
}

const apiService = new ApiService(
  "https://akamai-gw-crt.dbaas.aircanada.com/fs"
);
export default apiService;
