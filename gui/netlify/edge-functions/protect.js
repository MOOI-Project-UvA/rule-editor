export default async (request, context) => {
  console.log("The edge function is used!!!!!");

  const key = Netlify.env.get("X_API_KEY");
  console.log("request.url:", key);

  const allowedReferer = ""; // Change this to your domain
  // const secretApiKey = context.env.SECRET_API_KEY; // Store securely in Netlify env variables
  const MAX_REQUESTS = 1; // Max requests allowed per IP
  const TIME_WINDOW = 60; // Time window in seconds

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const referer = request.headers.get("referer") || "";
  // const apiKey = request.headers.get("x-api-key");

  // 1️⃣ Check Referer Header (Only allow your frontend site)
  console.log("referer:", referer, request.headers);
  // if (!referer.includes(allowedReferer)) {
  //   return new Response(
  //     JSON.stringify({ error: "Access denied: Invalid referer" }),
  //     {
  //       status: 403,
  //     },
  //   );
  // }

  // // 2️⃣ Check API Key
  // if (!apiKey || apiKey !== secretApiKey) {
  //     return new Response(JSON.stringify({ error: "Unauthorized: Invalid API key" }), {
  //         status: 401
  //     });
  // }

  // 3️⃣ Rate Limiting (Using Context Storage)
  // let requestCount = context.cookies.get(ip) || 0;
  // requestCount++;
  //
  // if (requestCount > MAX_REQUESTS) {
  //   return new Response(
  //     JSON.stringify({ error: "Too many requests. Try again later." }),
  //     {
  //       status: 429,
  //       headers: { "Retry-After": TIME_WINDOW.toString() },
  //     },
  //   );
  // }

  // Set/update request count in cookies
  // context.cookies.set(ip, requestCount, { maxAge: TIME_WINDOW });

  // Redirect to the serverless function
  const modifiedRequest = new Request(request, {
    headers: {
      ...request.headers,
      "x-edge-message": key,
    },
  });
  console.log("modified request:", modifiedRequest);
  return context.next(modifiedRequest);
};
