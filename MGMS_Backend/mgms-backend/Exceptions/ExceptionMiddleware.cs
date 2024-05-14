using Microsoft.IdentityModel.Tokens;

namespace mgms_backend.Exceptions
{
    // Middleware to handle exceptions thrown by the application 
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next; // Request delegate to call the next middleware in the pipeline
        private readonly ILogger<ExceptionMiddleware> _logger; // Logger to log exceptions 

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }

            catch (EntityNotFoundException exception)
            {
                // Not Found
                context.Response.StatusCode = 404;
                await context.Response.WriteAsJsonAsync(new { exception.Message });
            }

            catch (SecurityTokenExpiredException)
            {
                // Unauthorized 
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new
                {
                    Message = "The authentication token has expired. Please sign in again."
                });
            }

            catch (UnauthorizedAccessException exception)
            {
                // Unauthorized 
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new { exception.Message });
            }

            catch (ServerValidationException exception)
            {
                // Bad Request
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { exception.Message });
            }

            catch (Exception exception)
            {
                // Internal Server Error
                if (exception is
                    SecurityTokenInvalidSignatureException or
                    SecurityTokenInvalidIssuerException or
                    SecurityTokenInvalidAudienceException or
                    SecurityTokenValidationException)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsJsonAsync(new { Message = "You are not authorized to access this resource." });
                }
                else
                {
                    // Log the exception and return a generic error message
                    context.Response.StatusCode = 500;
                    _logger.LogCritical(exception.Message);
                    await context.Response.WriteAsJsonAsync(new { Message = "Internal Server Error." });
                }
            }
        }
    }
}
