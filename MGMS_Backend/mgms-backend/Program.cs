using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore; // For DbContext and UseNpgsql method 
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using mgms_backend.Data;
using mgms_backend.Exceptions;
using mgms_backend.Helpers;
using mgms_backend.Mappers.Implementation;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories;
using mgms_backend.Repositories.Implementation;
using mgms_backend.Repositories.Interface;

namespace mgms_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add DbContext and configure it to use PostgreSQL
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
                .UseLazyLoadingProxies());

            // Add HttpContextAccessor
            builder.Services.AddHttpContextAccessor();

            // Register the repository service 
            builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>(); // Feedback repository
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>(); // Notification repository
            builder.Services.AddScoped<IParkingSpotRepository, ParkingSpotRepository>(); // Parking spot repository
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>(); // Payment repository
            builder.Services.AddScoped<IProfileRepository, ProfileRepository>(); // Profile repository
            builder.Services.AddScoped<IReservationRepository, ReservationRepository>(); // Reservation repository
            builder.Services.AddScoped<IServiceRepository, ServiceRepository>(); // Service repository
            builder.Services.AddScoped<ISettingsRepository, SettingsRepository>(); // Settings repository
            builder.Services.AddScoped<IUserRepository, UserRepository>(); // User repository 

            // Register the mapper service
            builder.Services.AddScoped<IFeedbackMapper, FeedbackMapper>(); // Feedback mapper
            builder.Services.AddScoped<INotificationMapper, NotificationMapper>(); // Notification mapper
            builder.Services.AddScoped<IParkingSpotMapper, ParkingSpotMapper>(); // Parking spot mapper
            builder.Services.AddScoped<IPaymentMapper, PaymentMapper>(); // Payment mapper
            builder.Services.AddScoped<IReservationMapper, ReservationMapper>(); // Reservation mapper
            builder.Services.AddScoped<IServiceMapper, ServiceMapper>(); // Service mapper
            builder.Services.AddScoped<IUserMapper, UserMapper>(); // User mapper
            builder.Services.AddScoped<IUserHelper, UserHelper>(); // User helper

            // Add CORS (Cross-Origin Resource Sharing) policy to allow requests from the front-end application 
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicy", policy =>
                    {
                        policy.WithOrigins("http://localhost:3000") // Front-end application address
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials(); // Allow credentials like cookies, authorization headers, etc.
                    });
            });

            // Add controllers and configure JSON serialization options
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = null; // Disable reference tracking
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Add JWT authentication 
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Add Swagger with JWT support
            builder.Services.AddSwaggerGen(options =>
            {
                // Security definition for JWT token 
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "mgms_backend", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });

                // Add security requirements for JWT token
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("CorsPolicy"); // Enable CORS

            app.UseAuthentication(); // Enable authentication
            app.UseAuthorization();
            app.UseMiddleware<ExceptionMiddleware>(); // Custom exception middleware

            app.MapControllers();

            app.Run();
        }
    }
}
