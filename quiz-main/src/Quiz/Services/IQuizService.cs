using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Quiz.Models;

namespace Quiz.Services
{
    public interface IQuizService
    {
        public int Start();
        public void Next(int quizInstanceid);
        public void SetAnswer(int quizInstanceId, int questionId, int answerId, string userName);
    }
}
