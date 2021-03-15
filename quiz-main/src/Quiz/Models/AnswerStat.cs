using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class AnswerStat
    {
        public Answer answer { get; set; }
        public int count {get;set;}
        public AnswerStat(Answer a,int c = 0)
        {
            this.answer = a;this.count = c;
        }
    }
    
}
