using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class TopPlayer
    {
        public int totalScore { get; set; }
        public string nickName { get; set; }

        public TopPlayer(string name, int score)
        {
            this.totalScore = score;this.nickName = name;
        }
    }
}
