
using Quiz.Models;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    public interface IQuizRepository
    {
        public Task<int> CreateQuizAsync(int studiorumId);
        public Task AddUserAsync(string connectionId, string userName);
        public Task<Question> GetQuestionAsync(int quizId);
        public Task<QuizState> GetStateAsync(int quizId);


    }
}
