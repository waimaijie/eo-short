export async function onRequest({ request, env }) {
  const adminPath = env.ADMIN_PATH;

  // 1. If ADMIN_PATH is not set, the feature is disabled.
  // 2. The admin slug from the path must be passed in the headers for authentication.
  if (!adminPath || request.headers.get('X-Admin-Slug') !== adminPath) {
    return new Response('未授权', { status: 401 });
  }

  try {
    let allKeys = [];
    let cursor = undefined;
    let complete = false;

    do {
      const listOptions = cursor ? { cursor } : {};
      const result = await my_kv.list(listOptions);

      if (result.keys) {
        allKeys = allKeys.concat(result.keys);
      }

      cursor = result.cursor;
      complete = result.complete;
    } while (!complete);

    const links = await Promise.all(
      allKeys.map(async ({ key }) => {
        // Filter out hash keys and other non-link keys like 'visitCount'
        if (key.startsWith('hash:') || key === 'visitCount') {
          return null;
        }

        const value = await my_kv.get(key);
        if (value) {
          try {
            const data = JSON.parse(value);
            // Ensure it has the expected structure
            if (data.original) {
              return {
                slug: key,
                original: data.original,
                visits: data.visits || 0,
              };
            }
          } catch (e) {
            // Ignore values that are not valid JSON
            return null;
          }
        }
        return null;
      })
    );

    const validLinks = links.filter(Boolean);

    return new Response(JSON.stringify(validLinks), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: '获取链接列表失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 