﻿using Microsoft.EntityFrameworkCore;
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

        public async Task<Question> GetQuestionAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            Question currentQuestion = await context.Questions.Where(q => q.StudiorumId == quiz.StudiorumId && q.Id > quiz.CurrentQuestionId)
                                                         .OrderBy<Question, int>(q => q.Id)
                                                         .Include(q => q.Answers).FirstOrDefaultAsync();
            if (currentQuestion != null)
                quiz.CurrentQuestionId = currentQuestion.Id;
            else return null;
            // after we send the question, state has to change: a forward thinking logic
            quiz.State = QuizState.Showanswer;
            await context.SaveChangesAsync();
            return currentQuestion;
        }

        public async Task<QuizState> GetStateAsync(int quizId)
        {
            QuizInstance quizInstance = await context.QuizInstances.FindAsync(quizId);
            return quizInstance.State;
        }

        public async Task<(Answer,int)> SubmitAnswerAsync(int quizId, int answerId, string nickName)
        {
            Player p = await context.Players.Where(p => p.NickName == nickName).SingleOrDefaultAsync();
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            Answer answer = await context.Answers.FindAsync(answerId);
            int score = answer.IsCorrect ? 1000 : 0;

            context.AnswerInstances.Add(new AnswerInstance
            {
                Id = 0,
                Player = p,
                PlayerId = p.Id,
                IsCorrect = answer.IsCorrect,
                AnswerId = answerId,
                QuestionId = quiz.CurrentQuestionId,
                Quiz = quiz,
                QuizInstanceId = quiz.Id,
                Score = score
            });
            await context.SaveChangesAsync();

            return (answer, score);
        }

        public async Task<Answer> GetCorrectAnswerAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            quiz.State = QuizState.Showquestion;
            await context.SaveChangesAsync();
            Answer correctAnswer = await context.Answers.Where(a => a.QuestionId == quiz.CurrentQuestionId && a.IsCorrect == true).SingleOrDefaultAsync();
            return correctAnswer;
        }

        public async Task<List<AnswerStat>> GetAnswerSats(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            var answerInstances = await context.AnswerInstances.Where(ai => ai.QuizInstanceId == quizId &&
                                                                      ai.QuestionId == quiz.CurrentQuestionId)
                                                                      .Select(ai => ai.AnswerId)
                                                                      .ToListAsync();

            List<AnswerStat> answerstats = new List<AnswerStat>();
            var stats = new Dictionary<int,int>();
            var possibleAnswers = context.Answers.Where(a => a.QuestionId == quiz.CurrentQuestionId).ToList();

            foreach (var possibleans in possibleAnswers)
                answerstats.Add(new AnswerStat(possibleans, 0));

            foreach (var ansId in answerInstances)
                foreach (var ansstat in answerstats)
                {
                    if (ansstat.answer.Id == ansId)
                        ansstat.count++;
                }
            return answerstats;
        }

        public async Task<Player> CreatePlayerAsync(string userId, string nickName)
        {
            Player newPlayer = new Player { Id = 0, NickName = nickName, UserId = userId, TotalScore = 0 };
            await context.Players.AddAsync(newPlayer);
            await context.SaveChangesAsync();

            return newPlayer;
        }

        public async Task<List<TopPlayer>> GetTopPlayersAsync(int quizId)
        {
            List<TopPlayer> topPlayers = new List<TopPlayer>();

            var result = await context.AnswerInstances.Where(a => a.QuizInstanceId == quizId).GroupBy(a => a.PlayerId).Select(group => new {playerId = group.Key,totalScore = group.Sum(y => y.Score) }).ToListAsync();
            result.OrderByDescending(x => x.totalScore);
            result = result.Take(result.Count < 3 ? result.Count : 3 ).ToList();
            for (int i = 0; i < result.Count; i++)
            {
                var player = await context.Players.FindAsync(result[i].playerId);
                topPlayers.Add(new TopPlayer(player.NickName, result[i].totalScore));
            }

            return topPlayers;
        }

    }
}
