using System.Collections.Generic;
using Quiz.Data;
using Quiz.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Quiz.Hub;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.SignalR;
using System;

namespace Quiz.Services
{
    public class QuizService : IQuizService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<QuizHub, IQuizClient> quizHub;
        Question currentQuestion;
        int currentQuestionId;
        static int previousQuestionId;

        public QuizService(ApplicationDbContext context, IHubContext<QuizHub, IQuizClient> qH)
        {
            _context = context;
            quizHub = qH;
        }

        public int Start()
        {
            Console.WriteLine("Start called");
            currentQuestionId = 1;
            QuizInstance quiz = new QuizInstance { State = QuizState.Start, CurrentQuestionId = _context.Questions.Find(currentQuestionId).Id };
            _context.Add(quiz);
            _context.SaveChanges();
            int quizInstanceId = quiz.Id;
            return quizInstanceId;
        }

        public void Next(int quizInstanceId)
        {
            QuizInstance quizInstance = _context.QuizInstances.Find(quizInstanceId);

            switch (quizInstance.State)
            {
                case QuizState.Start:
                    quizInstance.State = QuizState.Showquestion;
                    currentQuestion = this.getCurrentQuestion(quizInstance);
                    _context.SaveChanges();
                    quizHub.Clients.All.ShowQuestion(currentQuestion);
                    Console.WriteLine("Start->Showquestion"+currentQuestion.Id);
                    break;
                case QuizState.Showquestion:
                    quizInstance.State = QuizState.Showanswer;
                    _context.SaveChanges();
                    currentQuestion = this.getCurrentQuestion(quizInstance);
                    quizHub.Clients.All.ShowQuestion(currentQuestion);
                    break;
                case QuizState.Showanswer:
                    currentQuestion = this.getCurrentQuestion(quizInstance);
                    foreach (var a in currentQuestion.Answers)
                    {
                        if (a.IsCorrect)
                        {
                            //quizHub.ShowAnswer(string question, UserAnswer[]{string answertext,bool isCorrect, int answerCount})
                            break;
                        }
                    }
                    // ha a kérdés Id-ja megegyezik a legmagasabb Idju kérdés id-val akkor ez az utlsó kérdés
                    var lastQuestionId = _context.Questions.OrderByDescending(q => q.Id).FirstOrDefault().Id;
                    if (currentQuestion.Id == lastQuestionId)
                    {
                        quizInstance.State = QuizState.Questionresult;
                    }
                    else
                    {
                        quizInstance.State = QuizState.Showquestion;
                        quizInstance.CurrentQuestionId = currentQuestion.Id+1;
                    }
                    _context.SaveChanges();
                    break;
                case QuizState.Questionresult:
                    quizInstance.State = QuizState.Quizresult;
                    _context.SaveChanges();
                    break;
                case QuizState.Quizresult:
                    currentQuestion = this.getCurrentQuestion(quizInstance);
                    if (quizInstance.CurrentQuestionId == this.QuestionCount() || quizInstance.CurrentQuestionId > this.QuestionCount())
                    {
                        
                      /*  var ansIn = _context.AnswerInstances.ToList();
                        var grouped = ansIn.GroupBy(a => a.Player, a => a.Score, (key, value) => new { User = key, Score = value });
                        List<UserScore> scores = _context.AnswerInstances.GroupBy(a => a.Player).Select(ai => new UserScore
                        { user = ai.Key, sumScore = ai.Sum(a => a.Score) }).OrderByDescending(a => a.sumScore).ToList();

                        quizInstance.State = QuizState.Questionresult;
                        _context.SaveChanges();
                      */
                        //ShowQuestionResults(UserResult[10]{string name, int score})
                    }
                    break;
                default: return;
            }
        }

        private int QuestionCount()
        {
            return _context.Questions.ToList().Count;
        }

        private Question getCurrentQuestion(QuizInstance quizInstance)
        {
            currentQuestion = _context.Questions.Where(q => q.Id == quizInstance.CurrentQuestionId || q.Id > quizInstance.CurrentQuestionId).Include(q => q.Answers).FirstOrDefault();
            return currentQuestion;
        }

        public class UserScore
        {
            public string user { get; set; }
            public int sumScore { get; set; }
        }

        public void SetAnswer(int quizInstanceId, int questionId, int answerId, string userName)
        {
            bool isGoodANswer = false;
            var question = _context.Questions.Where(q=> q.Id == questionId).Include(question => question.Answers).FirstOrDefault();
            int correctAnswerId = -1;
            foreach (Answer a in question.Answers)
            {
                if (a.IsCorrect)
                {
                    correctAnswerId = a.Id;
                    break;
                }
            }
            if (answerId == correctAnswerId)
                isGoodANswer = true;
            /*
            var user = new User();
            user.Name = userName;
            var ai = new AnswerInstance
            { QuestionId = questionId, AnswerId = answerId, Score = isGoodANswer ? 1: 0, isCorrect = isGoodANswer, Player = userName};
            _context.AnswerInstances.Add(ai);
            QuizInstance quizInstance = _context.QuizInstances.Find(quizInstanceId);
            _context.SaveChanges();
            */
        }

    }
}
