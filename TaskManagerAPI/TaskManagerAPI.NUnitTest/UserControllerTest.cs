using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.NUnitTest
{
    [TestFixture]
    public class UserControllerTest
    {
        private TaskManagerContext context;
        private UsersController controller;

        public static IEnumerable<TestCaseData> TestCaseSourceForPutUser
        {
            get
            {
                yield return new TestCaseData(1, new User
                {
                    EmployeeID = 1,
                    FirstName = "Tanmay",
                    LastName = "Vartak",
                    UserID = 1
                });
            }
        }

        public static IEnumerable<TestCaseData> TestCaseSourceForPostUser
        {
            get
            {
                yield return new TestCaseData(new User
                {
                    EmployeeID = 2,
                    FirstName = "Rohan",
                    LastName = "Raut",
                    UserID = 0
                });
            }
        }

        [SetUp]
        public async Task SetupAsync()
        {
            var options = new DbContextOptionsBuilder<TaskManagerContext>()
                       .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                       .Options;

            this.context = new TaskManagerContext(options);
            var u1 = new User
            {
                EmployeeID = 1,
                FirstName = "Tanmay",
                LastName = "Vartak",
                UserID = 1
            };

            var p1 = new Project
            {
                ProjectID = 1,
                ProjectName = "EY",
                Priority = 1,
                ManagerID = 1,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(2),
            };

            this.context.Users.Add(u1);
            this.context.SaveChanges();

            this.context.Projects.Add(p1);
            this.context.SaveChanges();

            var t1 = new Tasks
            {
                Name = "Task 1",
                TasksID = 1,
                ParentID = 0,
                EndDate = DateTime.Now.AddDays(7),
                Priority = 1,
                StartDate = DateTime.Now,
                UserID = 1,
                ProjectID = 1
            };
            var t2 = new Tasks
            {
                Name = "Task 2",
                TasksID = 2,
                ParentID = 1,
                EndDate = DateTime.Now.AddDays(5),
                Priority = 1,
                StartDate = DateTime.Now,
                UserID = 1,
                ProjectID = 1
            };
            var t3 = new Tasks
            {
                Name = "Task 3",
                TasksID = 3,
                ParentID = 2,
                EndDate = DateTime.Now,
                Priority = 1,
                StartDate = DateTime.Now.AddDays(-5),
                UserID = 1,
                ProjectID = 1
            };
            this.context.Tasks.AddRange(new Tasks[]
            {
                t1,t2,t3
            });

            await this.context.SaveChangesAsync();

            this.context.Entry<User>(u1).State = EntityState.Detached;
            this.context.Entry<Project>(p1).State = EntityState.Detached;
            this.context.Entry<Tasks>(t1).State = EntityState.Detached;
            this.context.Entry<Tasks>(t2).State = EntityState.Detached;
            this.context.Entry<Tasks>(t3).State = EntityState.Detached;

            //setup controller object;
            this.controller = new UsersController(this.context);
        }

        [Test, Order(1)]
        public async Task TestUsersGetUsersApi()
        {
            var lst = await context.Users.ToListAsync();
            var res = await this.controller.GetUsers();
            Assert.IsInstanceOf<ActionResult<IEnumerable<User>>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.Count, res.Value.Count(), "Users count should match with the count from Users table");
        }

        [TestCase(1)]
        [TestCase(2)]
        [Order(2)]
        public async Task TestUsersGetUsersByIdApi(int userId)
        {
            var lst = (await context.Users.ToListAsync()).Find(t => t.UserID.Equals(userId));
            var res = await this.controller.GetUser(userId);
            if (userId == 2)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<User>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.UserID, res.Value.UserID, "Users count should match with the count from Users table");
        }

        [TestCaseSource("TestCaseSourceForPutUser")]
        [Order(3)]
        public async Task TestUsersPutUserApi(int userId, User user)
        {
            var res = await this.controller.PutUser(userId, user);
            var lst = (await context.Users.ToListAsync()).Find(t => t.UserID.Equals(user.UserID));
            if (userId != user.UserID)
            {
                Assert.IsInstanceOf<BadRequestResult>(res, "in case of bad request it should return BadRequestResult");
                return;
            }

            if (userId == user.UserID && lst == null)
            {
                Assert.IsInstanceOf<NotFoundResult>(res, "in case of record not found it should return NotFoundResult");
                return;
            }

            Assert.IsInstanceOf<NoContentResult>(res, "Return type must be ActionResult");
            Assert.AreEqual(user.FirstName, lst.FirstName, "Users propertie should match with the request parameter after successful updates");
        }

        [TestCaseSource("TestCaseSourceForPostUser")]
        [Order(4)]
        public async Task TestUsersPostUserApi(User user)
        {
            var lst = (await context.Users.ToListAsync()).Last();
            user.UserID = lst.UserID + 1;
            var res = await this.controller.PostUser(user);
            lst = (await context.Users.ToListAsync()).Last();
            Assert.IsInstanceOf<CreatedAtActionResult>(res.Result, "Return type must be CreatedAtActionResult");
            Assert.AreEqual(user.FirstName, lst.FirstName, "Users propertie should match with the request parameter after successful post");
            Assert.AreEqual((((ObjectResult)res.Result).Value as User).UserID, user.UserID, "UserID should match after sucessfull post");
        }

        [TestCase(1)]
        [TestCase(2)]
        [Order(5)]
        public async Task TestUsersDeleteApi(int userId)
        {
            var lst = (await context.Users.ToListAsync()).Find(t => t.UserID.Equals(userId));
            var res = await this.controller.DeleteUser(userId);
            var lstAfterDelete = (await context.Users.ToListAsync()).Find(t => t.UserID.Equals(userId));
            if (userId == 2)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<User>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.UserID, res.Value.UserID, "Users count should match with the count from Users table");
            Assert.IsNull(lstAfterDelete, "After deletion last retreived object must be null");
        }
    }
}
