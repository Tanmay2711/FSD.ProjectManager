using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Models;

namespace Tests
{
    [TestFixture]
    public class TaskControllerTest
    {
        private TaskManagerContext context;
        private TasksController controller;

        public static IEnumerable<TestCaseData> TestCaseSourceForPutTask
        {
            get
            {
                yield return new TestCaseData(1, new Tasks
                {
                    Name = "Task 2",
                    TasksID = 1,
                    ParentID = 2,
                    EndDate = DateTime.Now.AddDays(3),
                    Priority = 4,
                    StartDate = DateTime.Now,
                    UserID = 1,
                    ProjectID = 1
                });
                yield return new TestCaseData(2, new Tasks
                {
                    Name = "Task 1",
                    TasksID = 3,
                    ParentID = 0,
                    EndDate = DateTime.Now.AddDays(6),
                    Priority = 2,
                    StartDate = DateTime.Now,
                    UserID = 1,
                    ProjectID = 1
                });
                yield return new TestCaseData(6, new Tasks
                {
                    Name = "Task 1",
                    TasksID = 6,
                    ParentID = 0,
                    EndDate = DateTime.Now.AddDays(6),
                    Priority = 2,
                    StartDate = DateTime.Now,
                    UserID = 1,
                    ProjectID = 1
                });
            }
        }

        public static IEnumerable<TestCaseData> TestCaseSourceForPostTask
        {
            get
            {
                yield return new TestCaseData(new Tasks
                {
                    Name = "New Task",
                    TasksID = 0,
                    ParentID = 2,
                    EndDate = DateTime.Now.AddDays(6),
                    Priority = 20,
                    StartDate = DateTime.Now,
                    UserID = 1,
                    ProjectID = 1
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
            this.controller = new TasksController(this.context);
        }

        [Test,Order(1)]
        public async Task TestTasksGetTasksApi()
        {
            var lst = await context.Tasks.ToListAsync();
            var res = await this.controller.GetTasks();
            Assert.IsInstanceOf<ActionResult<IEnumerable<Tasks>>>(res,"Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.Count, res.Value.Count(), "Tasks count should match with the count from Tasks table");
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [Order(2)]
        public async Task TestTasksGetTasksByIdApi(int taskId)
        {
            var lst = (await context.Tasks.ToListAsync()).Find(t => t.TasksID.Equals(taskId));
            var res = await this.controller.GetTasks(taskId);
            if(taskId == 4)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<Tasks>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.TasksID, res.Value.TasksID, "Tasks count should match with the count from Tasks table");
        }

        [TestCaseSource("TestCaseSourceForPutTask")]
        [Order(3)]
        public async Task TestTasksPutTaskApi(int taskId, Tasks task)
        {
            var res = await this.controller.PutTasks(taskId, task);
            var lst = (await context.Tasks.ToListAsync()).Find(t => t.TasksID.Equals(task.TasksID));
            if (taskId != task.TasksID)
            {
                Assert.IsInstanceOf<BadRequestResult>(res, "in case of bad request it should return BadRequestResult");
                return;
            }

            if(taskId == task.TasksID && lst == null)
            {
                Assert.IsInstanceOf<NotFoundResult>(res, "in case of record not found it should return NotFoundResult");
                return;
            }

            Assert.IsInstanceOf<NoContentResult>(res, "Return type must be ActionResult");
            Assert.AreEqual(task.Name, lst.Name, "Tasks propertie should match with the request parameter after successful updates");
        }

        [TestCaseSource("TestCaseSourceForPostTask")]
        [Order(4)]
        public async Task TestTasksPostTaskApi(Tasks task)
        {
            var lst = (await context.Tasks.ToListAsync()).Last();
            task.TasksID = lst.TasksID + 1;
            var res = await this.controller.PostTasks(task);
            lst = (await context.Tasks.ToListAsync()).Last();
            Assert.IsInstanceOf<CreatedAtActionResult>(res.Result, "Return type must be CreatedAtActionResult");
            Assert.AreEqual(task.Name, lst.Name, "Tasks propertie should match with the request parameter after successful post");
            Assert.AreEqual((((ObjectResult)res.Result).Value as Tasks).TasksID, task.TasksID, "TaskId should match after sucessfull post");
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(5)]
        [Order(5)]
        public async Task TestTasksDeleteApi(int taskId)
        {
            var lst = (await context.Tasks.ToListAsync()).Find(t => t.TasksID.Equals(taskId));
            var res = await this.controller.DeleteTasks(taskId);
            var lstAfterDelete = (await context.Tasks.ToListAsync()).Find(t => t.TasksID.Equals(taskId));
            if (taskId == 5)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<Tasks>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.TasksID, res.Value.TasksID, "Tasks count should match with the count from Tasks table");
            Assert.IsNull(lstAfterDelete, "After deletion last retreived object must be null");
        }
    }
}