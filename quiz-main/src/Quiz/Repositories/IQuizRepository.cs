
using Quiz.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    public interface IQuizRepository
    {
        public Task<int> CreateQuizAsync(int studiorumId);
        public Task<Question> GetQuestionAsync(int quizId);
        public Task<Answer> GetCorrectAnswerAsync(int quizId);
        public Task<QuizState> GetStateAsync(int quizId);
        public Task<List<AnswerStat>> GetAnswerSats(int quizId);
        public Task<bool> SubmitAnswerAsync(int quizId, AnswerSubmit answerSubmit, string userId);
        public Task<Player> CreatePlayerAsync(string UserId, string nickName, int quizId,string pin);
        public Task<List<TopPlayer>> GetTopPlayersAsync(int quizid);
        public Task<int> getUserAnswerResultAsync(string userId, int quizId);
        public Task<List<TopPlayer>> GetTopPlayersCurrentQuestion(int quizId);
        public Task<bool> IsNameTaken(string pin, string nickName);
        public Task RefreshQuizIdinPlayersTable(int quizId, string pin);

    }
}
