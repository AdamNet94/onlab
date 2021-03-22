using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class Studiorum
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<ApplicationUser> Owners { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
        public virtual ICollection<QuizInstance> Quizes { get; set; }
    }
}
