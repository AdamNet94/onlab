using Quiz.Models;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public interface IQuizClient
    {
        Task RenderNewPlayer(string user);
        Task ReceiveQuizId(int quizId,Question question);
        Task ShowQuestion(Question q);
        Task ReceiveCorrectAnswer(Answer correctAnswer);

        Task ReceiveResult(int correctAnswerId, int score);
        Task ShowQuestionResult();
        Task StartGame();
        Task Next();
        Task ShowResults();
    }
}
