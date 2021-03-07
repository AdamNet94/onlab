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
        private readonly ApplicationDbContext context;

        public QuizRepository(ApplicationDbContext _c)
        {
            this.context = _c;
        }

        public async Task<int> CreateQuizAsync(int studiorumId)
        {
            int firstQuestionId =  context.Studiorums
                .Find(studiorumId)
                .Questions
                .Select(q => q.Id).Min();

            var newQuiz = new QuizInstance
            {
                Id = 0, CurrentQuestionId = firstQuestionId,
                State = QuizState.Start,
                StudiorumId = studiorumId
            };

            await context.QuizInstances.AddAsync(newQuiz);
            await context.SaveChangesAsync();

            return newQuiz.Id;
        }
    }
}
