using Microsoft.VisualStudio.TestTools.UnitTesting;
using  Quiz.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Quiz.Models;
using Quiz.Services;

namespace TestQuiz
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestInit()
        {
          
            using (var db = createDbContext())
            {
                QuizService qs = new QuizService(db, null);
                var quizInstanceid = qs.Start();
                var quiz = db.QuizInstances.Find(quizInstanceid);
                Assert.IsNotNull(quiz);
                Assert.AreEqual(1, quiz.Id);

                qs.Next(quizInstanceid);
                Assert.AreEqual(QuizState.Showquestion, quiz.State);

            

            }

        }
        [TestMethod]
        public void TestMethod1()
        {

            using (var db = createDbContext())
            {
                

            }

        }

        private ApplicationDbContext createDbContext()
        {
            var contextOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            contextOptionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = aspnet" +
                " - Quiz - 53bc9b9d - 9d6a - 45d4 - 8429 - 2a2761773502; Trusted_Connection = True; MultipleActiveResultSets = true");

            return new ApplicationDbContext(contextOptionsBuilder.Options,null);
        }
    }
}
