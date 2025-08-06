using EmployeeMgmtBackend.Service;
using Microsoft.EntityFrameworkCore;

namespace EmployeeMgmtBackend.Data
{
    public class DataSeedHelper
    {
        private readonly AppDbContext dbContext;
        private DbContext dbContext1;

        public DataSeedHelper(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public DataSeedHelper(DbContext dbContext1)
        {
            this.dbContext1 = dbContext1;
        }

        public void InsertData()
        {
            if (!dbContext.Employees.Any())
            {
                dbContext.Employees.Add(new Entity.Employee { Name = "Employee 1" });
                dbContext.Employees.Add(new Entity.Employee { Name = "EMployee 2" });
            }
 

            if (!dbContext.Users.Any())
            {
                var passwordHelper = new PasswordHelper();
                dbContext.Users.Add(new Entity.User()
                {
                    Email = "admin@test.com",
                    Password = passwordHelper.HashPassword("12345"),
                    Role = "Admin"
                });

                dbContext.Users.Add(new Entity.User()
                {
                    Email = "employee@test.com",
                    Password = passwordHelper.HashPassword("12345"),
                    Role = "Employee"
                });
            }

            dbContext.SaveChanges();
        }
    }
}
