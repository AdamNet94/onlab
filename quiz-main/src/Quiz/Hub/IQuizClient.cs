using Quiz.Models;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public interface IQuizClient
    {
        Task RenderNewPlayer(string user);
        Task ReceiveQuizId(int quizId,Question question);
        Task ShowQuestion(Question q);

        Task ShowAnswer(string answer, string user);
        Task ShowQuestionResult();
        Task StartGame();
        Task Next();
        Task ShowResults();
    }
}
