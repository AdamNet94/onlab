using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class User
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public virtual ICollection<AnswerInstance> submittedAnswers { get; set; }
    }
}
