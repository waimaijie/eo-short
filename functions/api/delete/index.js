async function sha256(str) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest({ request, env }) {
  const adminPath = env.ADMIN_PATH;

  if (request.method !== 'POST') {
    return new Response('请求方法不允许', { status: 405 });
  }

  // Auth check based on the ADMIN_PATH environment variable
  if (!adminPath || request.headers.get('X-Admin-Slug') !== adminPath) {
    return new Response('未授权', { status: 401 });
  }

  const { slug } = await request.json();

  if (!slug) {
    return new Response('短链接标识是必需的', { status: 400 });
  }

  try {
    const linkDataStr = await my_kv.get(slug);
    if (linkDataStr) {
      const linkData = JSON.parse(linkDataStr);
      const urlHash = await sha256(linkData.original);
      await my_kv.delete(slug);
      await my_kv.delete(`hash:${urlHash}`);
    }

    return new Response(JSON.stringify({ success: true, slug }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: '删除链接失败' }), { status: 500 });
  }
} 