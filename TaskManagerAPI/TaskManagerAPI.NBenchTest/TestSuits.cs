using NBench;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Models;

namespace TaskManager.PerformanceTest
{
    public class TestSuits : PerformanceTest<TestSuits>
    {
        private TaskManagerContext context;

        [PerfBenchmark(RunMode = RunMode.Iterations, TestMode = TestMode.Measurement)]
        [MemoryMeasurement(MemoryMetric.TotalBytesAllocated)]
        public void GetTaskMemory_Test()
        {
            var taskController = new TasksController(context);
            var response = taskController.GetTasks();
        }

        [PerfBenchmark(RunMode = RunMode.Iterations, TestMode = TestMode.Measurement)]
        [MemoryMeasurement(MemoryMetric.TotalBytesAllocated)]
        public void GetParentTaskMemory_Test()
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
