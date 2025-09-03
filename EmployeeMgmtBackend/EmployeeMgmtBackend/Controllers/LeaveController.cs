using EmployeeMgmtBackend.Data;
using EmployeeMgmtBackend.Entity;
using EmployeeMgmtBackend.Migrations.Models;
using EmployeeMgmtBackend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeMgmtBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveController : ControllerBase
    {
        private readonly IRepository<Leave> leaveRepo;
        private readonly IRepository<Attendance> attendanceRepo;
        private readonly UserHelper userHelper;

        public LeaveController(IRepository<Leave> leaveRepo, IRepository<Attendance> attendanceRepo, UserHelper userHelper) 
        {
            this.leaveRepo = leaveRepo;
            this.attendanceRepo = attendanceRepo;
            this.userHelper = userHelper;
        }

        [HttpPost("apply")]
        [Authorize(Roles ="Employee")]
        public async Task<IActionResult> ApplyLeave([FromBody] LeaveDto model)
        {
            var date = TimeZoneInfo.ConvertTimeFromUtc(model.LeaveDate.Value, TimeZoneInfo.Local);
            var employeeId = await userHelper.GetEmployeeId(User);
            var leave = new Leave()
            {
                
                EmployeeId = employeeId.Value,
                Reason = model.Reason!,
                Type = (int)model.Type!,
                LeaveDate = date,
                Status = (int)LeaveStatus.Pending,
            };
            await leaveRepo.AddAsync(leave);
            await leaveRepo.SaveChangesAsync();
            return Ok();

        }


        [HttpPost("update-status")]
        [Authorize(Roles ="Employee,Admin")]
        public async Task<IActionResult> UpdateLeaveStatus([FromBody] LeaveDto model)
        {
            
            var leave = await leaveRepo.FindByIdAsync(model.Id!.Value);
            var isAdmin = await userHelper.IsAdmin(User);
            if (isAdmin) 
            {
                leave.Status = model.Status!.Value;

                if(model.Status.Value == (int)LeaveStatus.Accepted)
                {
                    await attendanceRepo.AddAsync(new Attendance()
                    {
                        Date = leave.LeaveDate,
                        EmployeeId = leave.EmployeeId,
                        Type = (int)AttendaceType.Leave
                    });
                }
            }
            else
            {
                if(model.Status == (int)LeaveStatus.Cancelled)
                {
                    leave.Status = model.Status!.Value;
                }
                else
                {
                    BadRequest();
                }
            }

            await leaveRepo.SaveChangesAsync();
            return Ok();

        }


        [HttpGet]
        [Authorize(Roles = "Employee,Admin")]
        public async Task<IActionResult> List([FromRoute] SearchOptions options)
        {
            List<Leave> list;
            if (await userHelper.IsAdmin(User))
            { 
                list = await leaveRepo.GetAll();
            }
            else
            {
                var employeeId = await userHelper.GetEmployeeId(User);
                list = await leaveRepo.GetAll(x=>x.EmployeeId==employeeId.Value);
            }

                var pagedData = new PagedData<Leave>();
            pagedData.TotalData = list.Count;

            if (options.PageIndex.HasValue)
            {
                pagedData.Data = list.Skip(options!.PageIndex!.Value * options!.PageSize!.Value)
                                     .Take(options.PageSize.Value).ToList();
            }
            else
            {
                pagedData.Data = list;

            }
            return Ok(pagedData);
        }
    }
}
