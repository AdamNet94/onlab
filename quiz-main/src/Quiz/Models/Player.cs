using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string NickName { get; set; }
        public int TotalScore { get; set; }
    }
}
