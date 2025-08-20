using EmployeeMgmtBackend.Data;
using EmployeeMgmtBackend.Entity;
using EmployeeMgmtBackend.Migrations.Models;
using EmployeeMgmtBackend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeMgmtBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> userRepo;
        private readonly IConfiguration configuration;
        private readonly IRepository<Employee> empRepo;

        public AuthController(IRepository<User> userRepo, IConfiguration configuration, IRepository<Employee> empRepo)
        {
            this.userRepo = userRepo;
            this.configuration = configuration;
            this.empRepo = empRepo;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDto model)
        {
            var user = (await userRepo.GetAll(x => x.Email == model.Email)).FirstOrDefault();
            
            if (user is null)
            {
                return new BadRequestObjectResult(new { message = "user not found" });
            }

            var passwordHelper = new PasswordHelper();

            if(!passwordHelper.VerifyPassword(user.Password, model.Password))
            {
                return new BadRequestObjectResult(new { message = "email or Password inccorect" });
            }

            var token = GenerateToken(user.Email, user.Role);

            return Ok(new AuthTokenDto()
            {
                Id = user.Id,
                Email = user.Email,
                Token = token,
                Role = user.Role,
            });
        }

        private string GenerateToken(string email, string role)
        {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name,email),
                new Claim(ClaimTypes.Role,role)
            };
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpPost("Profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileDto model)
        {
            var emaill = User.FindFirstValue(ClaimTypes.Name);
            var user = (await userRepo.GetAll(x => x.Email == emaill)).FirstOrDefault();
            var employee = (await empRepo.GetAll(x => x.Id == user.Id)).FirstOrDefault();
            if (employee != null)
            {
                
                if (!string.IsNullOrEmpty(employee.Name))
                {
                    employee.Name = model.Name;
                }
                
                if (!string.IsNullOrEmpty(employee.Phone))
                {
                    employee.Phone = model.Phone;
                }

                empRepo.Update(employee);
            }
            
            
            if (!string.IsNullOrEmpty(model.Email))
            {
                user.Email = model.Email;
            }

           
            if (!string.IsNullOrEmpty(model.Email))
            {
                user.ProfileImage = model.ProfileImage;
            }

            if (!string.IsNullOrEmpty(model.Password))
            {
                var passwordHelper = new PasswordHelper();
                user.Password = passwordHelper.HashPassword(model.Password);
            }
            
            userRepo.Update(user);
            await userRepo.SaveChangesAsync();
            return Ok();

        }


        [Authorize]
        [HttpGet("Profile")]
        public async Task<IActionResult> GetProfile()
        {
            var emaill = User.FindFirstValue(ClaimTypes.Name);
            var user = (await userRepo.GetAll(x => x.Email == emaill)).FirstOrDefault();
            var employee = (await empRepo.GetAll(x => x.Id == user.Id)).FirstOrDefault();
            return Ok(new ProfileDto
            {
                Name = employee?.Name,
                Email = employee.Email,
                Phone = employee?.Phone,
                ProfileImage = user.ProfileImage
            });

        }


    }
}
