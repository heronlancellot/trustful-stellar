import { parseQueryParams } from '@/lib/utils/parseQueryParams';
import axios from 'axios';
import { IGenericHttpClient } from './types';

class HttpClient implements IGenericHttpClient {
  private readonly _baseUrl: string;

  constructor(baseUrl: string | undefined) {
    // Fallback para desenvolvimento local
    this._baseUrl = baseUrl || 'http://localhost:3000';
  }

  async post<T, P extends Object, B extends Object>(
    path: string,
    query: P,
    body: B
  ): Promise<T> {
    const fullPath = [this._baseUrl, path, '?', parseQueryParams(query)].join(
      ''
    );
    const response = await axios.post<T>(fullPath, body);
    return response.data;
  }

  async get<T, P extends Object>(path: string, query: P): Promise<T> {
    const fullPath = [this._baseUrl, path, '?', parseQueryParams(query)].join(
      ''
    );
    const response = await axios.get<T>(fullPath);
    return response.data;
  }
}

// Criando uma instância com fallback para desenvolvimento
const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL);
export default httpClient;
