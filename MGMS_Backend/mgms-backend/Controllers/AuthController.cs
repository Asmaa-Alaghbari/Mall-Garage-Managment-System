using Microsoft.AspNetCore.Mvc; 
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims; 
using System.Text;

using MGMSBackend.Models; 
using MGMSBackend.DTO;

namespace MGMSBackend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    public class AuthController : ControllerBase
    {
        public static User user = new User(); // Create a new user object to store the user data
        public IConfiguration _configuration; // Configuration object to access app settings

        public AuthController(IConfiguration configuration) 
        { 
            _configuration = configuration; 
        }

        // POST: api/auth/Register 
        [HttpPost("Register")] // Route to the Register endpoint 
        public ActionResult<User> Register(UserDto request)
        {
            // Hash the password using BCrypt.Net library 
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password); 

            user.FirstName = request.FirstName; // Set the user first name
            user.LastName = request.LastName; // Set the user last name
            user.Username = request.Username; // Set the user username
            user.Email = request.Email; // Set the user email
            user.Password = passwordHash; // Set the user password
            user.Phone = request.Phone; // Set the user phone number
            user.Role = "User"; // Set the user role to User as default 
            user.DateCreated = DateTime.Now; // Set the user creation date to the current date

            return Ok(user); // Return the user object with the created user data 
        }

        // POST: api/auth/Login
        [HttpPost("Login")] // Route to the Login endpoint
        public ActionResult<User> Login(UserDto request)
        {
            if (user.Username == request.Username) // Check if the username exists
            {
                if (BCrypt.Net.BCrypt.Verify(request.Password, user.Password)) // Verify the password
                {
                    string token = CreateToken(user); // Create a JWT token with user data

                    return Ok(token); ; // Return the JWT token 
                }
                else
                {
                    return BadRequest("Invalid password"); // Return an error message for invalid password
                }
            }
            else
            {
                return BadRequest("User not found"); // Return an error message for user not found
            }
        }

        // Create a JWT token with user data 
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.Role, "User"),
            };

            // Create a symmetric security key using the app settings token (Secret key for token generation) 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!)); // ! is used to avoid null reference exception

            // Create signing credentials using the HMACSHA512 signature algorithm (Hash-based Message Authentication Code)
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Create a JWT token with the claims, expiration date, and signing credentials
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            // Write the token as a string and return it 
            try
            {
                var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                return jwt; // jwt.io can be used to decode the token and view the claims
            }
            catch (Exception ex)
            {
                // Log the exception or return an error response
                Console.WriteLine(ex.Message);
                return null; // Or handle the error appropriately
            }
        }

    }
}