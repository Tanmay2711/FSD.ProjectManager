using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
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

        [OneTimeSetUp]
        public async Task SetupAsync()
        {
            var options = new DbContextOptionsBuilder<TaskManagerContext>()
                       .UseInMemoryDatabase(databaseName: "InMemoryTaskManagerDatabase")
                       .Options;

            this.context = new TaskManagerContext(options);
            this.context.Tasks.AddRange(new Tasks[]
            {
                new Tasks
                {
                    Name = "Task 1",
                    TasksID = 1,
                    ParentID = 0,
                    EndDate = DateTime.Now.AddDays(7),
                    Priority = 1,
                    StartDate = DateTime.Now
                },
                new Tasks
                {
                    Name = "Task 2",
                    TasksID = 2,
                    ParentID = 1,
                    EndDate = DateTime.Now.AddDays(5),
                    Priority = 1,
                    StartDate = DateTime.Now
                },
                new Tasks
                {
                    Name = "Task 3",
                    TasksID = 3,
                    ParentID = 2,
                    EndDate = DateTime.Now,
                    Priority = 1,
                    StartDate = DateTime.Now.AddDays(-5)
                }
            });

            await this.context.SaveChangesAsync();

            //setup controller object;
            this.controller = new TasksController(this.context);
        }

        [Test]
        public async Task Test1Async()
        {
            var lst = await context.Tasks.ToListAsync();
            Assert.Pass();
        }
    }
}