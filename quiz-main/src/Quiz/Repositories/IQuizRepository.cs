
using Quiz.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    public interface IQuizRepository
    {
        public Task<int> CreateQuizAsync(int studiorumId);
        public Task AddUserAsync(string connectionId, string userName);
        public Task<Question> GetQuestionAsync(int quizId);
        public Task<Answer> GetCorrectAnswerAsync(int quizId);
        public Task<QuizState> GetStateAsync(int quizId);
        public Task<List<AnswerStat>> GetAnswerSats(int quizId);
        public Task<(Answer,int)> submitAnswerAsync(int quizId,int answerId, string connectionId);


    }
}
