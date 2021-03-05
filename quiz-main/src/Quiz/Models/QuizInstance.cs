using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Models
{
    public class QuizInstance
    {
        public int Id { get; set; }
        public QuizState State { get; set; }
        public int CurrentQuestionId { get; set; }
        public int StudiorumId { get; set; }
        public virtual ICollection<AnswerInstance> SubmittedAnswers{ get; set; }
         
        public Studiorum Studiorum { get; set; }
    }
        public enum QuizState
        {
            Start,
            Showquestion,
            Showanswer,
            Questionresult,
            Quizresult
        }
}
