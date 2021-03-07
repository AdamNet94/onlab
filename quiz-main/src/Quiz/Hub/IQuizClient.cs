using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public interface IQuizClient
    {
        Task RenderNewPlayer(string user);
        Task ReceiveQuizId(int quizId);

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
