import { g as getCollection } from './chunks/_astro_content_DkalvaRB.mjs';
import 'es-module-lexer';
import './chunks/shared_B6bdXPNh.mjs';
import 'piccolore';
import { o as originPathnameSymbol, A as AstroError, j as ForbiddenRewrite } from './chunks/astro/server_Bi_ABpQi.mjs';
import 'clsx';
import 'html-escaper';
import { a as appendForwardSlash, r as removeTrailingForwardSlash } from './chunks/consts_DWGWWeUs.mjs';

function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}

function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) {
    pathname = "/";
  }
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") {
    finalPathname = "/";
  } else if (shouldAppendSlash) {
    finalPathname = appendForwardSlash(pathname);
  } else {
    finalPathname = removeTrailingForwardSlash(pathname);
  }
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}

function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}

function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request.clone());
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request.clone()
              );
            }
            const oldPathname = handleContext.url.pathname;
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(
              handleContext.request,
              oldPathname,
              pipeline.manifest.trailingSlash,
              pipeline.manifest.buildFormat
            );
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}

function defineMiddleware(fn) {
  return fn;
}

const apiContextRoutesSymbol = Symbol.for("context.routes");

const AI_USER_AGENTS = /(?:GPTBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot|OAI-SearchBot)/i;
const BINARY_ASSET = /\.(?:pdf|docx|xlsx|zip)$/i;
const decodeHtmlEntities = (value) => value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
const htmlToMarkdown = (html) => decodeHtmlEntities(html).replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n").replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n").replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n").replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**").replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**").replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n").replace(/<br\s*\/?>(?:\r?\n)?/gi, "\n").replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n").replace(/<\/?(?:ul|ol|figure|figcaption|table|thead|tbody|tr|td|th)[^>]*>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const maintenanceMode = process.env.MAINTENANCE_MODE?.toLowerCase() === "true";
  if (maintenanceMode && url.pathname !== "/503") {
    return context.rewrite(new URL("/503", url));
  }
  if (BINARY_ASSET.test(url.pathname)) {
    const response = await next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }
  if (context.isPrerendered) return next();
  const accept = request.headers.get("accept") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const wantsMarkdown = accept.toLowerCase().includes("text/markdown") || AI_USER_AGENTS.test(userAgent);
  const articleMatch = url.pathname.match(/^\/aktualnosci\/([^/]+)\/?$/);
  if (!wantsMarkdown || !articleMatch || request.method !== "GET") {
    return next();
  }
  const posts = await getCollection("news");
  const post = posts.find((entry) => entry.data.slug === articleMatch[1]);
  if (!post) return next();
  const canonicalUrl = new URL(`/aktualnosci/${post.data.slug}/`, url.origin).href;
  const markdown = [
    `# ${post.data.title}`,
    `Canonical URL: ${canonicalUrl}`,
    "",
    `> ${post.data.description}`,
    "",
    htmlToMarkdown(post.body ?? "")
  ].join("\n");
  return new Response(`${markdown.trim()}
`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, User-Agent",
      "Cache-Control": "public, max-age=300"
    }
  });
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
