
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
        public Task<(Answer, int)> SubmitAnswerAsync(int quizId, int answerId, string connectionId);
        public Task<Player> CreatePlayerAsync(string UserId, string nickName);
        public Task<List<TopPlayer>> GetTopPlayersAsync(int quizid);

    }
}
