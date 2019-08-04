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
    public class ProjectControllerTest
    {
        private TaskManagerContext context;
        private ProjectsController controller;

        public static IEnumerable<TestCaseData> TestCaseSourceForPutProject
        {
            get
            {
                yield return new TestCaseData(1, new Project
                {
                    ProjectID = 1,
                    ProjectName = "EY Updated",
                    Priority = 1,
                    ManagerID = 1,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(2),
                });
            }
        }

        public static IEnumerable<TestCaseData> TestCaseSourceForPostProject
        {
            get
            {
                yield return new TestCaseData(new Project
                {
                    ProjectID = 0,
                    ProjectName = "Canvas",
                    Priority = 1,
                    ManagerID = 1,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(3),
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
            this.controller = new ProjectsController(this.context);
        }

        [Test, Order(1)]
        public async Task TestUsersGetProjectsApi()
        {
            var lst = await context.Projects.ToListAsync();
            var res = await this.controller.GetProjects();
            Assert.IsInstanceOf<ActionResult<IEnumerable<Project>>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.Count, res.Value.Count(), "Projects count should match with the count from Projects table");
        }

        [TestCase(1)]
        [TestCase(2)]
        [Order(2)]
        public async Task TestProjectsGetProjectsByIdApi(int proectId)
        {
            var lst = (await context.Projects.ToListAsync()).Find(t => t.ProjectID.Equals(proectId));
            var res = await this.controller.GetProject(proectId);
            if (proectId == 2)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<Project>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.ProjectID, res.Value.ProjectID, "Projects count should match with the count from Project table");
        }

        [TestCaseSource("TestCaseSourceForPutProject")]
        [Order(3)]
        public async Task TestProjectsPutProjectApi(int projectId, Project project)
        {
            var res = await this.controller.PutProject(projectId, project);
            var lst = (await context.Projects.ToListAsync()).Find(t => t.ProjectID.Equals(project.ProjectID));
            if (projectId != project.ProjectID)
            {
                Assert.IsInstanceOf<BadRequestResult>(res, "in case of bad request it should return BadRequestResult");
                return;
            }

            if (projectId == project.ProjectID && lst == null)
            {
                Assert.IsInstanceOf<NotFoundResult>(res, "in case of record not found it should return NotFoundResult");
                return;
            }

            Assert.IsInstanceOf<NoContentResult>(res, "Return type must be ActionResult");
            Assert.AreEqual(project.ProjectName, lst.ProjectName, "Projects propertie should match with the request parameter after successful updates");
        }

        [TestCaseSource("TestCaseSourceForPostProject")]
        [Order(4)]
        public async Task TestProjectsPostProjectApi(Project project)
        {
            var lst = (await context.Projects.ToListAsync()).Last();
            project.ProjectID = lst.ProjectID + 1;
            var res = await this.controller.PostProject(project);
            lst = (await context.Projects.ToListAsync()).Last();
            Assert.IsInstanceOf<CreatedAtActionResult>(res.Result, "Return type must be CreatedAtActionResult");
            Assert.AreEqual(project.ProjectName, lst.ProjectName, "Projects propertie should match with the request parameter after successful post");
            Assert.AreEqual((((ObjectResult)res.Result).Value as Project).ProjectID, project.ProjectID, "ProjectID should match after sucessfull post");
        }

        [TestCase(1)]
        [TestCase(2)]
        [Order(5)]
        public async Task TestProjectsDeleteApi(int projectId)
        {
            var lst = (await context.Projects.ToListAsync()).Find(t => t.ProjectID.Equals(projectId));
            var res = await this.controller.DeleteProject(projectId);
            var lstAfterDelete = (await context.Projects.ToListAsync()).Find(t => t.ProjectID.Equals(projectId));
            if (projectId == 2)
            {
                Assert.IsInstanceOf<NotFoundResult>(res.Result, "in case of record not found it should return NotFoundResult");
                return;
            }
            Assert.IsInstanceOf<ActionResult<Project>>(res, "Return type must be ActionResult");
            Assert.IsNotNull(res.Value, "Action result value must not be null");
            Assert.AreEqual(lst.ProjectID, res.Value.ProjectID, "Projects count should match with the count from Projects table");
            Assert.IsNull(lstAfterDelete, "After deletion last retreived object must be null");
        }
    }
}
