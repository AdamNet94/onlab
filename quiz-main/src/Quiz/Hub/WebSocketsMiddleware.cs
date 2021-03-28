using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public class WebSocketsMiddleware
    {
        private readonly RequestDelegate _next;

        public WebSocketsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var request = httpContext.Request;

            // web sockets cannot pass headers so we must take the access token from query param and
            // add it to the header before authentication middleware runs
            if (request.Path.StartsWithSegments("/quizhub", StringComparison.OrdinalIgnoreCase) &&
                request.Query.TryGetValue("accessTokenFactory", out var accessToken))
            {
                request.Headers.Add("Authorization", accessToken);
            }

            await _next(httpContext);
        }
    }
}
