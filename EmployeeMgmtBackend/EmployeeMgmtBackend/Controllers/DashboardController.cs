using EmployeeMgmtBackend.Data;
using EmployeeMgmtBackend.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeMgmtBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IRepository<Employee> empRepo;
        private readonly IRepository<Department> depRepo;

        public DashboardController(IRepository<Employee> empRepo, IRepository<Department> depRepo)
        {
            this.empRepo = empRepo;
            this.depRepo = depRepo;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> TotalSalary()
        {
            var empList = await empRepo.GetAll();
            var totalSalry = empList.Sum(x => x.Salary ?? 0);
            var employeeCount = empList.Count;
            var deptList = await depRepo.GetAll();
            var departmentCount = deptList.Count;
            return Ok(new
            {
                TotalSalary = totalSalry,
                employeeCount = employeeCount,
                departmentCount = departmentCount,
            });
        }
    }
}
