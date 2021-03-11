using Microsoft.EntityFrameworkCore;
using Quiz.Data;
using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    
    public class QuizRepository : IQuizRepository
    {
        private ApplicationDbContext context;

        public QuizRepository(ApplicationDbContext _c)
        {
            this.context = _c;
        }

        public async Task<int> CreateQuizAsync(int studiorumId)
        {

           /* var questionsIds = context.Questions.Where(q => q.StudiorumId == studiorumId)
            .GroupBy(q => q.Id).Select(x => new { minquestId = x.Min(z => z.Id) }).ToList();*/

            var newQuiz = new QuizInstance
            {
                Id = 0, CurrentQuestionId = 0,
                State = QuizState.Showquestion,
                StudiorumId = studiorumId
            };

            await context.QuizInstances.AddAsync(newQuiz);
            await context.SaveChangesAsync();

            return newQuiz.Id;
        }

        public async Task AddUserAsync(string connectionId, string userName)
        {
            await context.Players.AddAsync(new Player { Id = 0, ConnectionId = connectionId, Name = userName });
            await context.SaveChangesAsync();
        }

        public async Task<Question> GetQuestionAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            Question currentQuestion = await context.Questions.Where(q => q.StudiorumId == quiz.StudiorumId && q.Id > quiz.CurrentQuestionId)
                                                         .OrderBy<Question,int>(q => q.Id)
                                                         .Include(q => q.Answers).FirstOrDefaultAsync();
            return currentQuestion;
        }



        public async Task<QuizState> GetStateAsync(int quizId)
        {
            QuizInstance quizInstance = await context.QuizInstances.FindAsync(quizId);
            return quizInstance.State;
        }

           
    }
}
