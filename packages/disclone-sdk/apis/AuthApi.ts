/* tslint:disable */
/* eslint-disable */
/**
 * Disclone Proxy API
 * Basic API proxy for Disclone
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ErrorResult,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/index';
import {
    ErrorResultFromJSON,
    ErrorResultToJSON,
    LoginRequestFromJSON,
    LoginRequestToJSON,
    LoginResponseFromJSON,
    LoginResponseToJSON,
    LogoutResponseFromJSON,
    LogoutResponseToJSON,
    RegisterRequestFromJSON,
    RegisterRequestToJSON,
    RegisterResponseFromJSON,
    RegisterResponseToJSON,
} from '../models/index';

export interface LoginOperationRequest {
    loginRequest: LoginRequest;
}

export interface RegisterOperationRequest {
    registerRequest: RegisterRequest;
}

/**
 * 
 */
export class AuthApi extends runtime.BaseAPI {

    /**
     * Logs in a user
     */
    async loginRaw(requestParameters: LoginOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LoginResponse>> {
        if (requestParameters.loginRequest === null || requestParameters.loginRequest === undefined) {
            throw new runtime.RequiredError('loginRequest','Required parameter requestParameters.loginRequest was null or undefined when calling login.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginRequestToJSON(requestParameters.loginRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LoginResponseFromJSON(jsonValue));
    }

    /**
     * Logs in a user
     */
    async login(requestParameters: LoginOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LoginResponse> {
        const response = await this.loginRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Logs out a user
     */
    async logoutRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LogoutResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/auth/logout`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LogoutResponseFromJSON(jsonValue));
    }

    /**
     * Logs out a user
     */
    async logout(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LogoutResponse> {
        const response = await this.logoutRaw(initOverrides);
        return await response.value();
    }

    /**
     * Registers a user
     */
    async registerRaw(requestParameters: RegisterOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegisterResponse>> {
        if (requestParameters.registerRequest === null || requestParameters.registerRequest === undefined) {
            throw new runtime.RequiredError('registerRequest','Required parameter requestParameters.registerRequest was null or undefined when calling register.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/register`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegisterRequestToJSON(requestParameters.registerRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterResponseFromJSON(jsonValue));
    }

    /**
     * Registers a user
     */
    async register(requestParameters: RegisterOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegisterResponse> {
        const response = await this.registerRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
