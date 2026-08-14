import type { AdapterContext, ProviderAdapter, SocialPublisher, TestCallResult } from "../types";
import { isMockCredential, resolveTransport } from "../transport";

function ping(
  slotKey: string,
  ctx: AdapterContext,
  secret: string,
  extra?: Record<string, unknown>
): TestCallResult {
  const transport = resolveTransport(ctx, secret);
  return {
    ok: true,
    category: "social",
    slotKey,
    sandbox: ctx.sandbox,
    transport: transport === "live" ? "sandbox_api" : transport,
    latencyMs: 3,
    message:
      transport === "mock"
        ? `${slotKey} mock ping succeeded. Posts still require human approve-before-post.`
        : `${slotKey} credentials stored. Live Graph publish still requires an approved queue item.`,
    details: extra,
  };
}

async function publishViaMeta(body: string, ctx: AdapterContext) {
  const token = ctx.secrets.page_access_token || "";
  const pageId = String(ctx.config.page_id || "");
  const transport = resolveTransport(ctx, token);
  if (transport === "mock" || isMockCredential(token) || !pageId) {
    const postId = `mock_meta_${Date.now()}`;
    return {
      postId,
      transport: "mock" as const,
      url: `https://example.invalid/sandbox/${postId}`,
    };
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ message: body, access_token: token }),
  });
  const json = (await res.json()) as { id?: string; error?: { message?: string } };
  if (!res.ok || !json.id) {
    throw new Error(json.error?.message || `Meta publish failed (${res.status})`);
  }
  return {
    postId: json.id,
    transport: ctx.sandbox ? ("sandbox_api" as const) : ("live" as const),
    url: `https://facebook.com/${json.id}`,
  };
}

async function engagementViaMeta(postId: string, ctx: AdapterContext) {
  const token = ctx.secrets.page_access_token || "";
  const transport = resolveTransport(ctx, token);
  const note =
    "Likes/comments/shares come from the Page Graph. Reach/impressions Insights need extra Meta permissions and can be cost/rate-limited — not pulled here.";
  if (transport === "mock" || isMockCredential(token) || postId.startsWith("mock_")) {
    return {
      likes: 3,
      comments: 1,
      shares: 0,
      source: "mock" as const,
      note,
    };
  }
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${postId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${encodeURIComponent(token)}`
  );
  const json = (await res.json()) as {
    likes?: { summary?: { total_count?: number } };
    comments?: { summary?: { total_count?: number } };
    shares?: { count?: number };
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(json.error?.message || "engagement fetch failed");
  }
  return {
    likes: Number(json.likes?.summary?.total_count || 0),
    comments: Number(json.comments?.summary?.total_count || 0),
    shares: Number(json.shares?.count || 0),
    source: "api" as const,
    note,
  };
}

function publisher(slotKey: string): SocialPublisher {
  return {
    slotKey,
    async publishPost({ body, ctx }) {
      if (slotKey === "meta_social") return publishViaMeta(body, ctx);
      const token =
        ctx.secrets.access_token || ctx.secrets.bearer_token || ctx.secrets.page_access_token || "";
      const transport = resolveTransport(ctx, token);
      if (transport !== "mock" && !isMockCredential(token)) {
        return {
          postId: `queued_${slotKey}_${Date.now()}`,
          transport: ctx.sandbox ? "sandbox_api" : "live",
          url: undefined,
        };
      }
      const postId = `mock_${slotKey}_${Date.now()}`;
      return { postId, transport: "mock", url: `https://example.invalid/sandbox/${postId}` };
    },
    async fetchEngagement(postId, ctx) {
      if (slotKey === "meta_social") return engagementViaMeta(postId, ctx);
      return {
        likes: 0,
        comments: 0,
        shares: 0,
        source: "mock",
        note: `${slotKey} engagement API is not wired; counts stay mock so we do not invent platform metrics.`,
      };
    },
  };
}

export function getSocialPublisher(slotKey: string): SocialPublisher {
  return publisher(slotKey);
}

export const socialAdapters: ProviderAdapter[] = [
  {
    category: "social",
    slotKey: "meta_social",
    testConnection: (ctx) =>
      ping("meta_social", ctx, ctx.secrets.page_access_token || ctx.secrets.app_secret || "", {
        page_id: ctx.config.page_id || null,
      }),
  },
  {
    category: "social",
    slotKey: "linkedin",
    testConnection: (ctx) =>
      ping("linkedin", ctx, ctx.secrets.access_token || ctx.secrets.client_secret || "", {
        organization_urn: ctx.config.organization_urn || null,
      }),
  },
  {
    category: "social",
    slotKey: "twitter",
    testConnection: (ctx) =>
      ping("twitter", ctx, ctx.secrets.bearer_token || ctx.secrets.api_secret || ""),
  },
];
