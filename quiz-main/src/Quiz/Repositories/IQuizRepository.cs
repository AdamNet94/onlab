using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Repositories
{
    public interface IQuizRepository
    {
        public Task<int> CreateQuiz(int studiorumId);
    }
}
