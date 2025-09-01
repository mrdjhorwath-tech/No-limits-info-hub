exports.handler = async (event) => {
  const defaultUrl = "https://calendar.google.com/calendar/ical/3e51a6301fe688400bab1734bd7a40587d841334eb26cbdbbfc3bcfa63f1e065%40group.calendar.google.com/public/basic.ics";
  const url = (event.queryStringParameters && event.queryStringParameters.url) ? decodeURIComponent(event.queryStringParameters.url) : defaultUrl;

  try {
    const resp = await fetch(url, { headers: { "User-Agent": "NetlifyFunctions-ICSProxy" } });
    if (!resp.ok) {
      return { statusCode: resp.status, body: `Upstream error: ${resp.status}` };
    }
    const text = await resp.text();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "max-age=60"
      },
      body: text
    };
  } catch (e) {
    return { statusCode: 500, body: "Proxy error: " + (e && e.message ? e.message : e) };
  }
};