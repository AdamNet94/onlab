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

            var questionsIds = context.Questions.Where(q => q.StudiorumId == studiorumId)
            .GroupBy(q => q.Id).Select(x => new { minquestId = x.Min(z => z.Id) }).ToList();

            
            var newQuiz = new QuizInstance
            {
                Id = 0, CurrentQuestionId = questionsIds[0].minquestId,
                State = QuizState.Start,
                StudiorumId = studiorumId
            };

            await context.QuizInstances.AddAsync(newQuiz);
            await context.SaveChangesAsync();

            return newQuiz.Id;
        }
    }
}
