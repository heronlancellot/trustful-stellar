import { parseQueryParams } from "@/lib/utils/parseQueryParams";
import axios from "axios";
import { envVars } from "@/lib/environmentVars";
import { IGenericHttpClient } from "./types";

class HttpClient implements IGenericHttpClient {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl)
      throw new Error("HttpClient constructor: baseUrl empty or invalid");
    this._baseUrl = baseUrl;
  }

  async post<T, P extends Object, B extends Object>(
    path: string,
    query: P,
    body: B,
  ): Promise<T> {
    const fullPath = [this._baseUrl, path, "?", parseQueryParams(query)].join(
      "",
    );
    console.log("fullPath", fullPath);
    const response = await axios.post<T>(fullPath, body);
    console.log("response", response);
    return response.data;
  }

  async get<T, P extends Object>(path: string, query: P): Promise<T> {
    const fullPath = [this._baseUrl, path, "?", parseQueryParams(query)].join(
      "",
    );
    console.log("fullPath get", fullPath);
    const response = await axios.get<T>(fullPath);
    console.log("response get", response);
    return response.data;
  }
}

const httpClient = new HttpClient(envVars.NEXT_PUBLIC_API_URL);
export default httpClient;
