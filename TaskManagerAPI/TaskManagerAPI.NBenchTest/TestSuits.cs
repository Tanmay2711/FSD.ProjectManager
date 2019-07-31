using Microsoft.EntityFrameworkCore;
using NBench;
using System;
using System.Threading.Tasks;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Models;

namespace TaskManager.PerformanceTest
{
    public class TestSuits : PerformanceTest<TestSuits>
    {
        private TaskManagerContext context;

        public TestSuits()
        {
            this.SetupAsync().GetAwaiter().GetResult();
        }

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
        }

        [PerfBenchmark(RunMode = RunMode.Iterations, TestMode = TestMode.Measurement)]
        [MemoryMeasurement(MemoryMetric.TotalBytesAllocated)]
        public void GetTaskMemory_Test()
        {
            var taskController = new TasksController(context);
            var response = taskController.GetTasks();
        }

        [PerfBenchmark(RunMode = RunMode.Iterations, TestMode = TestMode.Measurement)]
        [MemoryMeasurement(MemoryMetric.TotalBytesAllocated)]
        public void GetTaskByIdMemory_Test()
        {
            var taskController = new TasksController(context);
            var response = taskController.GetTasks(1);
        }

    }
}
