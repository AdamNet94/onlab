using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class TopPlayer
    {
        int totalScore = 0;
        string nickName = "";

        public TopPlayer(string name, int score)
        {
            this.totalScore = score;this.nickName = name;
        }
    }
}
