using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int QuestionID { get; set; }
        public bool IsCorrect { get; set; }
    }

}

