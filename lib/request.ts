/**
 * HTTP 请求封装工具
 * 基于 fetch API，提供统一的 GET、POST、PUT、DELETE 方法
 */

/**
 * API 响应结构
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 请求配置选项
 */
interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  /** URL 查询参数 */
  params?: Record<string, string | number | boolean>;
}

/**
 * 构建完整的 URL（包含查询参数）
 */
function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
}

/**
 * 请求拦截器：统一添加 credentials 配置
 */
function requestInterceptor(options: RequestInit): RequestInit {
  const { headers, ...restOptions } = options;
  
  return {
    ...restOptions,
    // 自动携带 Cookie（包括 HttpOnly Cookie）
    credentials: 'include',
    // 默认设置 JSON 内容类型
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    },
  } as RequestInit;
}

/**
 * 响应拦截器：统一处理响应和错误
 */
async function responseInterceptor<T = any>(response: Response): Promise<ApiResponse<T>> {
  // 检查 HTTP 状态码
  if (!response.ok) {
    throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`);
  }

  // 解析 JSON 响应
  const result: ApiResponse<T> = await response.json();

  // 检查业务逻辑是否成功
  if (!result.success) {
    throw new Error(result.message || '请求失败');
  }

  return result;
}

/**
 * GET 请求
 * @param url 请求地址
 * @param options 请求配置（可包含 params 查询参数）
 */
export async function get<T = any>(
  url: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const finalUrl = buildUrl(url, options?.params);
  const interceptedOptions = requestInterceptor({
    method: 'GET',
    ...options,
  });

  const response = await fetch(finalUrl, interceptedOptions);
  return responseInterceptor<T>(response);
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param options 请求配置
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const interceptedOptions = requestInterceptor({
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });

  const response = await fetch(url, interceptedOptions);
  return responseInterceptor<T>(response);
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param options 请求配置
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const interceptedOptions = requestInterceptor({
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });

  const response = await fetch(url, interceptedOptions);
  return responseInterceptor<T>(response);
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param options 请求配置
 */
export async function del<T = any>(
  url: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const interceptedOptions = requestInterceptor({
    method: 'DELETE',
    ...options,
  });

  const response = await fetch(url, interceptedOptions);
  return responseInterceptor<T>(response);
}
