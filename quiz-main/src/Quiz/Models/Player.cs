using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string NickName { get; set; }
        public string Pin { get; set; }
        public int QuizInstanceId { get; set; }
        public int TotalScore { get; set; }
    }     
}
