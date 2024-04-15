using Microsoft.EntityFrameworkCore; // For DbContext and UseNpgsql method 
using Microsoft.OpenApi.Models; 
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using mgms_backend.Data;
using mgms_backend.Repositories;
using mgms_backend.Models;

namespace mgms_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // Add DbContext and configure it to use PostgreSQL
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register the repository service 
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IParkingSpotRepository, ParkingSpotRepository>();
            builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

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

            builder.Services.AddControllers();
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

            app.MapControllers();

            app.Run();
        }
    }
}
