// api/proxy.js
module.exports = async (req, res) => {
    const { method, body, query, headers } = req;
    const urlPath = req.url.replace('/api/proxy', '');
    const url = `http://3.89.218.76:8006${urlPath}${query ? `?${new URLSearchParams(query).toString()}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "accept": "application/json",
          ...(method === "POST" && { "content-type": headers["content-type"] }),
          ...(headers.authorization && { Authorization: headers.authorization })
        },
        body: method === "POST" ? body : undefined
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Proxy request failed" });
    }
  };