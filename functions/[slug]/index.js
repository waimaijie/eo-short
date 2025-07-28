const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>短链接生成器</title>
    <meta name="description" content="短链接生成您提供短网址在线生成，短链接生成，支持连接缩短，免费提供API接口。" />
    <meta name="keywords" content="短网址,短网址生成,短链接,短链接生成,短链接生成器,短网址转换,网址缩短,短地址,缩短网址,长链接转短链接" />
    <style>
        :root { --bg-color: #111827; --container-bg: #1f2937; --input-bg: #374151; --border-color: #4b5563; --text-color: #f3f4f6; --subtle-text: #9ca3af; --accent-color: #facc15; --accent-hover: #eab308; --error-color: #f87171; --success-color: #4ade80; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 1rem; box-sizing: border-box; }
        .container { width: 100%; max-width: 600px; background-color: var(--container-bg); border-radius: .75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, .25); padding: 2rem; }
        h1 { text-align: center; margin-bottom: 2rem; font-size: 2.25rem; }
        form { background-color: var(--input-bg); padding: 1rem; border-radius: .5rem; margin-bottom: 1rem; }
        .form-main { display: flex; gap: .5rem; }
        #url-input { flex-grow: 1; padding: .75rem 1rem; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: .5rem; color: var(--text-color); font-size: 1rem; transition: border-color .2s, box-shadow .2s; }
        #url-input:focus { outline: none; border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(250, 204, 21, .3); }
        .advanced-options { margin-top: 1rem; }
        .advanced-options label { display: flex; align-items: center; gap: .5rem; color: var(--subtle-text); }
        #slug-input { padding: .5rem; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: .5rem; color: var(--text-color); }
        button { padding: .75rem 1.5rem; background-color: var(--accent-color); color: var(--bg-color); border: none; border-radius: .5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background-color .2s; }
        button:hover { background-color: var(--accent-hover); }
        button:disabled { background-color: #4b5563; cursor: not-allowed; }
        #error-message, #success-message { text-align: center; margin-bottom: 1rem; padding: .75rem; border-radius: .5rem; display: none; transition: opacity .3s ease-in-out; }
        #error-message { color: var(--error-color); background-color: rgba(248, 113, 113, .1); }
        #success-message { color: var(--success-color); background-color: rgba(74, 222, 128, .1); }
        #success-message a { font-weight: 600; color: var(--accent-color); text-decoration: none; }
        #success-message .copy-btn { margin-left: 1rem; background-color: var(--input-bg); color: var(--text-color); padding: .25rem .75rem; font-size: .8rem; border-radius: .5rem; border: 1px solid var(--border-color); cursor: pointer; }
        #success-message .copy-btn:hover { background-color: var(--border-color); }
    </style>
</head>
<body>
<a href="https://github.com/hobk/eo-short" target="_blank" class="github-corner" style="position:fixed;top:0;right:0;" aria-label="View source on GitHub">
    <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#facc15; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
    </svg>
</a>
<div class="container">
    <h1>短链接生成器</h1>
    <form id="link-form">
        <div class="form-main">
            <input type="url" id="url-input" placeholder="请输入长链接" required>
            <button type="submit" id="submit-btn">生成</button>
        </div>
        <div class="advanced-options">
            <label>
                自定义短链接 (可选):
                <input type="text" id="slug-input" placeholder="例如: my-link">
            </label>
        </div>
    </form>
    <div id="error-message"></div>
    <div id="success-message"></div>
</div>
<script>
    const form = document.getElementById('link-form');
    const urlInput = document.getElementById('url-input');
    const slugInput = document.getElementById('slug-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    async function createLink(e) {
        e.preventDefault();
        const originalUrl = urlInput.value;
        if (!originalUrl) return;

        const customSlug = slugInput.value.trim();
        setLoading(true);
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        try {
            const payload = { url: originalUrl };
            if (customSlug) {
                payload.slug = customSlug;
            }
            const res = await fetch('/api/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || '创建链接失败。');
            }
            const newLink = await res.json();
            urlInput.value = '';
            slugInput.value = '';
            showSuccess(newLink);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function showSuccess(newLink) {
        const shortUrl = \`\${window.location.origin}/\${newLink.slug}\`;
        successMessage.innerHTML = \`
            <span>成功！链接为: <a href="\${shortUrl}" target="_blank">\${shortUrl.replace(/^https?:\\/\\//, '')}</a></span>
            <button class="copy-btn" data-url="\${shortUrl}">复制</button>
        \`;
        successMessage.style.display = 'block';
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? '生成中...' : '生成';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => { errorMessage.style.display = 'none'; }, 3000);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            navigator.clipboard.writeText(e.target.dataset.url).then(() => {
                e.target.textContent = '已复制!';
                setTimeout(() => { e.target.textContent = '复制'; }, 1500);
            });
        }
    });

    form.addEventListener('submit', createLink);
</script>
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