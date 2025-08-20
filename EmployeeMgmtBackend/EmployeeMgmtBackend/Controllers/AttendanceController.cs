using EmployeeMgmtBackend.Data;
using EmployeeMgmtBackend.Entity;
using EmployeeMgmtBackend.Migrations.Models;
using EmployeeMgmtBackend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeMgmtBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IRepository<Attendance> attendanceRepo;
        private readonly UserHelper userHelper;

        public AttendanceController(IRepository<Attendance> attendanceRepo, UserHelper userHelper)
        {
            this.attendanceRepo = attendanceRepo;
            this.userHelper = userHelper;
        }

        [HttpPost("mark-present")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> MarkAttendance()
        {
            var employeeId = await userHelper.GetEmployeeId(User);
            var attendaceList = await attendanceRepo.GetAll(x => x.EmployeeId == employeeId.Value &&
            DateTime.Compare(x.Date.Date, DateTime.UtcNow.Date) == 0);
            if (attendaceList.Count > 0)
            {
                return BadRequest("Already Present");
            }
            var attendance = new Attendance()
            {
                Date = DateTime.UtcNow,
                EmployeeId = employeeId.Value,
                Type = (int)AttendaceType.Present,
            };
            await attendanceRepo.AddAsync(attendance);
            await attendanceRepo.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendaceHistory([FromQuery] SearchOptions options)
        {
            if(!await userHelper.IsAdmin(User))
            {
                options.EmployeeId = await userHelper.GetEmployeeId(User);
            }
            var list = await attendanceRepo.GetAll(x => x.EmployeeId == options.EmployeeId!.Value);
            var pagedData = new PagedData<Attendance>();
            pagedData.TotalData= list.Count;
            if (options.PageIndex.HasValue)
            {
                list = list.Skip(options.PageIndex.Value * options.PageSize.Value)
                       .Take(options.PageSize.Value).ToList();
            }
            pagedData.Data = list;
            return Ok(pagedData);
        }
    }
}
