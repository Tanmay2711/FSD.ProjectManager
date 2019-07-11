using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManagerAPI.Models
{
    public class Tasks
    {
        public int TasksID { get; set; }
        public int ParentID { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Status { get; set; }

        public int Priority { get; set; }

        public int UserID { get; set; }
        public User User { get; set; }

        public int ProjectID { get; set; }
        public Project Project { get; set; }
    }
}
