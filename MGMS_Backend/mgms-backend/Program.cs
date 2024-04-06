using Microsoft.EntityFrameworkCore; // For DbContext and UseNpgsql method 
using mgms_backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

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

            // Add CORS policy to allow requests from the front-end application 
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicy",
                    policy =>
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
