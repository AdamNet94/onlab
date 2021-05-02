
using Quiz.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    public interface IQuizRepository
    {
        public Task<int> CreateQuizAsync(int studiorumId, string pin, int questionTime);
        public Task ChangeQuizState(int quizId, QuizState newQuizState);
        public Task<Question> GetNextQuestionAsync(int quizId);
        public Task<Question> GetCurrentQuestionAsync(int quizId);
        public Task<Answer> GetCorrectAnswerAsync(int quizId);
        public Task<QuizState> GetStateAsync(int quizId);
        public Task<List<AnswerStat>> GetAnswerSats(int quizId);
        public Task<bool> SubmitAnswerAsync(int quizId, int answerId, string userId);
        public Task<Player> CreatePlayerAsync(string UserId, string nickName, int quizId,string pin);
        public Task<List<TopPlayer>> GetTopPlayersAsync(int quizid);
        public Task<int> getUserAnswerResultAsync(string userId, int quizId);
        public Task<List<TopPlayer>> GetTopPlayersCurrentQuestion(int quizId);
        public Task<bool> IsNameTaken(string pin, string nickName);
        public Task RefreshQuizIdinPlayersTable(int quizId, string pin);
        public Task<int> getQuizId(string pin);
        public Task<int> DecreaseTimer(int quizId);
        public Task SetTimer(int quizId);

    }
}
