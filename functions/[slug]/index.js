const indexHtml = `<!DOCTYPE html>
<html>
    <head>
        <meta charset=utf-8 />
        <title> Not Found </title>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
                border: 0;
            }

            body {
                background-image: linear-gradient(137deg, #2E457B 0%, #237431 100%) !important;
                background-attachment: fixed;
                color: #333;
                font-family: Arial, Verdana, Tahoma;
                font-size: 13px;
            }

            #main {
                background: #FFF;
                box-shadow: 0 0 40px #00275A;
                margin-top: 65px;
                padding-top: 20px;
                padding-bottom: 20px;
                width: 100%;
            }

            #mainwrapper {
                display: table;
                text-align: center;
                margin: 0 auto;
            }

            h1 {
                color: #EE6628;
                font-size: 44px;
                font-weight: normal;
                text-shadow: 1px 1px 2px #A7A7A7;
            }

            h2 {
                color: #385792;
                font-weight: normal;
                font-size: 25px;
                text-shadow: 1px 1px 2px #D4D4D4;
            }

            ul {
                text-align: left;
                margin-top: 20px;
            }

            p {
                margin-top: 20px;
                color: #888;
            }

            a {
                color: #4D73BB;
                text-decoration: none;
            }

            a:hover, a:focus {
                text-decoration: underline;
            }
        </style>
    </head>
    
    <body>

        <div id="main">
            <div id="mainwrapper">
                <h1>404 Not Found.</h1>
                <h2>The url you visit is not found.</h2>
            </div>
        </div>
    </body>   
</html>
`;

const adminHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理后台 - 短链接</title>
    <style>
        :root { --bg-color: #111827; --container-bg: #1f2937; --border-color: #4b5563; --text-color: #f3f4f6; --error-color: #f87171; --accent-color: #facc15; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; padding: 1rem; }
        .container { width: 100%; max-width: 900px; margin: auto; background-color: var(--container-bg); border-radius: .75rem; padding: 2rem; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: .75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
        .delete-btn { background-color: var(--error-color); color: #fff; border: none; padding: .25rem .75rem; border-radius: .5rem; cursor: pointer; transition: background-color .2s; }
        .delete-btn:hover { background-color: #ef4444; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
<div class="container">
    <h1>管理后台</h1>
    <p>链接总数: <span id="link-count">0</span></p>
    <table>
        <thead>
            <tr>
                <th>短链接</th>
                <th>原始链接</th>
                <th>访问次数</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody id="links-table-body"></tbody>
    </table>
</div>
<script>
    const linksTableBody = document.getElementById('links-table-body');
    const linkCount = document.getElementById('link-count');
    const adminSlug = window.location.pathname.split('/').pop();

    const authHeaders = {
        'Content-Type': 'application/json',
        'X-Admin-Slug': adminSlug
    };

    async function getLinks() {
        try {
            const res = await fetch('/api/links', { headers: authHeaders });
            if (!res.ok) {
                if (res.status === 401) {
                  document.body.innerHTML = '<h1>未授权访问</h1>';
                }
                throw new Error('获取链接列表失败。');
            }
            const links = await res.json();
            linkCount.textContent = links.length;
            renderLinks(links);
        } catch(err) {
            console.error(err);
        }
    }

    function renderLinks(links) {
        linksTableBody.innerHTML = '';
        links.sort((a, b) => b.visits - a.visits);
        for (const link of links) {
            const shortUrl = \`\${window.location.origin}/\${link.slug}\`;
            const row = document.createElement('tr');
            row.dataset.slug = link.slug;
            row.innerHTML = \`
                <td><a href="\${shortUrl}" target="_blank">\${shortUrl.replace(/^https?:\\/\\//, '')}</a></td>
                <td><a href="\${link.original}" target="_blank" title="\${link.original}">\${link.original.substring(0, 50) + (link.original.length > 50 ? '...' : '')}</a></td>
                <td>\${link.visits}</td>
                                 <td><button class="delete-btn" data-slug="\${link.slug}">删除</button></td>
            \`;
            linksTableBody.appendChild(row);
        }
    }

    async function deleteLink(slug) {
        if (!confirm(\`您确定要删除短链接 "\${slug}" 吗？\`)) return;
        try {
            const res = await fetch('/api/delete', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ slug }),
            });
            if (!res.ok) throw new Error('删除失败。');
            document.querySelector(\`tr[data-slug="\${slug}"]\`).remove();
            linkCount.textContent = parseInt(linkCount.textContent) - 1;
        } catch (err) {
            alert(err.message);
        }
    }

    linksTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            deleteLink(e.target.dataset.slug);
        }
    });

    getLinks();
</script>
</body>
</html>
`;

export async function onRequest({ request, params, env }) {
  const { slug } = params;
  const adminPath = env.ADMIN_PATH;

  // Serve admin panel only if the path is set and matches the slug
  if (adminPath && slug === adminPath) {
    return new Response(adminHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (!slug || slug === 'favicon.ico') {
    return new Response(indexHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const link = await my_kv.get(slug);
    if (link) {
      const linkData = JSON.parse(link);
      linkData.visits = (linkData.visits || 0) + 1;
      await my_kv.put(slug, JSON.stringify(linkData));
      return Response.redirect(linkData.original, 302);
    }
  } catch (err) {
    console.error(`KV Error: ${err.message}`);
  }

  return new Response(indexHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    status: 404
  });
}
