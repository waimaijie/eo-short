async function sha256(str) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { url, slug: customSlug } = await request.json();
  const adminPath = env.ADMIN_PATH;

  if (!url) {
    return new Response('URL 是必需的', { status: 400 });
  }

  // Check if this URL has been shortened before (and no custom slug is being attempted)
  const urlHash = await sha256(url);
  const existingSlug = await my_kv.get(`hash:${urlHash}`);

  if (existingSlug && !customSlug) { // If it exists and user is not trying to create a new custom one
    const existingLinkData = await my_kv.get(existingSlug);
    if (existingLinkData) {
      return new Response(JSON.stringify({ slug: existingSlug, ...JSON.parse(existingLinkData) }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  let slug = customSlug;

  if (slug) {
    // Check for conflict with admin path
    if (adminPath && slug === adminPath) {
      return new Response(JSON.stringify({ error: '此自定义短链接已被使用，请重试。' }), { status: 409, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    // Validate custom slug: only allow alphanumeric characters and dashes/underscores
    if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      return new Response(JSON.stringify({ error: '自定义短链接只能包含字母、数字、连字符和下划线。' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    // Check if the custom slug is already taken
    const existing = await my_kv.get(slug);
    if (existing) {
      return new Response(JSON.stringify({ error: '此自定义短链接已被使用，请重试。' }), { status: 409, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  } else {
    // Generate a random, unique, and non-conflicting short slug
    let newSlug, existing;
    do {
      newSlug = Math.random().toString(36).substring(2, 8);
      existing = await my_kv.get(newSlug);
    } while (existing || (adminPath && newSlug === adminPath));
    slug = newSlug;
  }

  const linkData = {
    original: url,
    visits: 0,
  };

  await my_kv.put(slug, JSON.stringify(linkData));
  await my_kv.put(`hash:${urlHash}`, slug); // Add the reverse mapping

  return new Response(JSON.stringify({ slug, ...linkData }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 