/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


/**
 * LM Arena 代理服务 - Cloudflare Workers 最小化版本
 */

// URL配置数组，按照start日期排序（大的在前）
const URL_CONFIG = [
  {
    start: 19,
    url: "https://pdsjifsoyqoy.us-west-1.clawcloudrun.com"
  },
  {
    start: 1,
    url: "https://hzaxwwzmncif.ap-northeast-1.clawcloudrun.com"
  }
];

/**
 * 根据当前日期获取应该使用的URL
 */
function getTargetUrl() {
  const today = new Date();
  const dayOfMonth = today.getDate();

  // 遍历已排序的配置数组，找到第一个满足条件的URL
  for (const config of URL_CONFIG) {
    if (dayOfMonth >= config.start) {
      return config.url;
    }
  }

  // 如果没有找到匹配的，使用最后一个（最小start值的）
  return URL_CONFIG[URL_CONFIG.length - 1].url;
}

/**
 * 处理CORS头部
 */
function addCorsHeaders(headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  headers.set('Access-Control-Allow-Headers', '*');
  return headers;
}

/**
 * 转发请求到目标URL
 */
async function forwardRequest(request) {
  try {
    // 构建新的请求URL
    const originalUrl = new URL(request.url);
    const targetUrl = getTargetUrl();
    const newUrl = new URL(targetUrl);

    // 保持原始路径和查询参数
    newUrl.pathname = originalUrl.pathname;
    newUrl.search = originalUrl.search;

    // 准备请求头
    const newHeaders = new Headers();
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (!['host', 'origin', 'referer'].includes(lowerKey)) {
        newHeaders.set(key, value);
      }
    }
    newHeaders.set('host', newUrl.host);

    const fetchOptions = {
      method: request.method,
      headers: newHeaders,
      redirect: 'follow'
    };

    // 添加 body（如果需要）
    if (!['GET', 'HEAD'].includes(request.method)) {
      fetchOptions.body = request.body;
    }

    const response = await fetch(newUrl.toString(), fetchOptions);

    // 如果有跨域问题开启 添加 CORS 头部到响应
    // const responseHeaders = addCorsHeaders(new Headers(response.headers));

    // return new Response(response.body, {
    //   status: response.status,
    //   statusText: response.statusText,
    //   headers: responseHeaders
    // });
    
    //直接返回响应
    return response;
  
  } catch (error) {
    throw new Error(`Proxy error: ${error.message}`);
  }
}

/**
 * Cloudflare Workers 入口函数
 */
export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: addCorsHeaders(new Headers())
      });
    }

    try {
      // 直接转发请求，不处理路径
      return await forwardRequest(request);

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: addCorsHeaders(new Headers({
          'Content-Type': 'application/json'
        }))
      });
    }
  }
};
