import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ): Promise<APIResponse> {
    return await this.request.get(endpoint, { params });
  }

  async post(endpoint: string, data: object): Promise<APIResponse> {
    return await this.request.post(endpoint, { data });
  }

  async put(endpoint: string, data: object): Promise<APIResponse> {
    return await this.request.put(endpoint, { data });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return await this.request.delete(endpoint);
  }
}
