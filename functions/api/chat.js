const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function resolveApiKey(env) {
  return (
    env.OPENROUTER_API_KEY ||
    env.OPENROUTER_API_KEY_NEW ||
    env.OPENROUTER_API_KEY_2 ||
    env.OPEN_ROUTER_API_KEY ||
    ""
  );
}

function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "*";
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin") || "*";
  const apiKey = resolveApiKey(env);

  if (!apiKey) {
    return jsonResponse(
      {
        error: {
          message:
            "Server is missing OpenRouter API key. Add one of: OPENROUTER_API_KEY / OPENROUTER_API_KEY_NEW / OPENROUTER_API_KEY_2.",
        },
      },
      400,
      corsHeaders(origin)
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: { message: "Invalid JSON body." } },
      400,
      corsHeaders(origin)
    );
  }

  if (!body || typeof body !== "object") {
    return jsonResponse(
      { error: { message: "Request body is required." } },
      400,
      corsHeaders(origin)
    );
  }

  if (!body.model || !Array.isArray(body.messages)) {
    return jsonResponse(
      { error: { message: "Both model and messages are required." } },
      400,
      corsHeaders(origin)
    );
  }

  const referer = env.PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const upstreamResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "Safarnama AI",
      },
      body: JSON.stringify(body),
    });

    const responseText = await upstreamResponse.text();
    const contentType =
      upstreamResponse.headers.get("Content-Type") || "application/json; charset=utf-8";

    if (upstreamResponse.status >= 500) {
      let upstreamMessage = responseText;
      try {
        const parsed = JSON.parse(responseText);
        upstreamMessage = parsed?.error?.message || parsed?.message || upstreamMessage;
      } catch (_) {}

      return jsonResponse(
        {
          error: {
            message: `OpenRouter service error (${upstreamResponse.status}).`,
            detail: String(upstreamMessage || "Unknown upstream error."),
          },
        },
        502,
        corsHeaders(origin)
      );
    }

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        ...corsHeaders(origin),
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        error: {
          message: "Failed to reach OpenRouter.",
          detail: String(error?.message || error),
        },
      },
      502,
      corsHeaders(origin)
    );
  }
}




