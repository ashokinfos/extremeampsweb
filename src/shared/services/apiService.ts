import axiosInstance from './axiosInstance';

// Generic API Service
class ApiService {
  // Generic GET Request
  public static async get<T>(url: string, params?: object): Promise<T> {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  }

  // Generic POST Request
  public static async post<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  }

  // Generic PUT Request
  public static async put<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  }

  // Generic PATCH Request
  public static async patch<T>(url: string, data?: object): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  }

  // Generic DELETE Request
  public static async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }

  // Blob GET (for file downloads)
  public static async getBlob(url: string): Promise<Blob> {
    const response = await axiosInstance.get(url, { responseType: 'blob' });
    return response.data;
  }
}

export default ApiService;
