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
        public string Pin { get; set; }
        public int QuestionStartTime { get; set; }
        public int CurrentQuestionTime { get; set; }
        public Studiorum Studiorum { get; set; }
    }
        public enum QuizState
        {
            Start,
            PreviewQuestion,
            Showquestion,
            Showanswer,
            Questionresult,
            Quizresult
        }
}
