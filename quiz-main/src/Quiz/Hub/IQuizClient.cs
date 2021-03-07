using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public interface IQuizClient
    {

        public Task getQuizPin();
        Task ReceiveMessage(int quizId, string message);

        Task ShowQuestion(Question q);
        Task ShowAnswer(string answer, string user);
        Task ShowQuestionResult();
        Task UserJoined(User user);
        Task SetUsers(List<User> users);
        Task StartGame();
        Task Next();
        Task ShowResults();
    }
}
