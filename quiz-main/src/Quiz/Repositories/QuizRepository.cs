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

        public async Task<int> CreateQuizAsync(int studiorumId, string pin,int questionTime)
        {
            var newQuiz = new QuizInstance
            {
                Id = 0, CurrentQuestionId = 0,
                State = QuizState.Showquestion,
                Pin = pin,
                QuestionStartTime = questionTime,
                CurrentQuestionTime = questionTime,
                StudiorumId = studiorumId,
            };

            await context.QuizInstances.AddAsync(newQuiz);
            await context.SaveChangesAsync();

            return newQuiz.Id;
        }

        public async Task ChangeQuizState(int quizId,QuizState newQuizState)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            quiz.State = newQuizState;
            await context.SaveChangesAsync();
        }

        public async Task<Question> GetNextQuestionAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            Question currentQuestion = await context.Questions.AsNoTracking().Where(q => q.StudiorumId == quiz.StudiorumId && q.Id > quiz.CurrentQuestionId)
                                                         .OrderBy<Question, int>(q => q.Id)
                                                         .Include(q => q.Answers).FirstOrDefaultAsync();

            if (currentQuestion != null)
            {
                quiz.CurrentQuestionId = currentQuestion.Id;
            }
            else return null;
            return currentQuestion;
        }

        public async Task<Question> GetCurrentQuestionAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            return await context.Questions.Include(q => q.Answers).Where(q => q.Id == quiz.CurrentQuestionId).SingleAsync();
        }


        public async Task<QuizState> GetStateAsync(int quizId)
        {
            QuizInstance quizInstance = await context.QuizInstances.FindAsync(quizId);
            return quizInstance.State;
        }

        public async Task<int> getQuizId(string pin)
        {
            QuizInstance quiz = await context.QuizInstances.Where(q => q.Pin == pin).SingleAsync();
            return quiz.Id;
        }

        public async Task<bool> SubmitAnswerAsync(int quizId, int answerId, string userId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);

            //making sure we dont submit answer after time is up, bc of the forward thinking logic during the question
            // the state is actually Showanswer and not ShowQuestion
            if (quiz.State != QuizState.Showanswer)
                return false;
            Player p = await context.Players.Where(p => p.UserId == userId && p.QuizInstanceId == quizId).SingleOrDefaultAsync();
            Answer answer = await context.Answers.FindAsync(answerId);


            int score = 0;
            if (answer != null)
                score = answer.IsCorrect ? CalculateScore(quiz.CurrentQuestionTime, quiz.QuestionStartTime) : 0 ;

            AnswerInstance newAnswer = new AnswerInstance
            {
                Id = 0,
                Player = p,
                PlayerId = p.Id,
                IsCorrect = answer.IsCorrect,
                AnswerId = answer.Id,
                QuestionId = quiz.CurrentQuestionId,
                Quiz = quiz,
                QuizInstanceId = quiz.Id,
                Score = score
            };

            await context.AnswerInstances.AddAsync(newAnswer);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<int> getUserAnswerResultAsync(string userId, int quizId)
        {
            QuizInstance quiz = await getQuiz(quizId);
            Player p = await context.Players.Where(p => p.UserId == userId && p.QuizInstanceId == quizId).FirstOrDefaultAsync();
            int score = 0;
            try
            {
                score = context.AnswerInstances
                .Where(a => a.PlayerId == p.Id && a.QuestionId == quiz.CurrentQuestionId)
                .Select(a => a.Score).FirstOrDefault();
            }
            catch(InvalidOperationException e)
            {
                return 0;
            }
            
            return score;
        }

        public async Task<Answer> GetCorrectAnswerAsync(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
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

        public async Task<Player> CreatePlayerAsync(string userId, string nickName, int quizId,string pin)
        {
           Player newPlayer = await context.Players.Where(p => p.UserId == userId && p.QuizInstanceId == quizId).FirstOrDefaultAsync();
            if (newPlayer == null)
            {
                newPlayer = new Player { Id = 0, NickName = nickName, UserId = userId, TotalScore = 0, QuizInstanceId = quizId, Pin = pin };
                await context.Players.AddAsync(newPlayer);
            }
            else
                newPlayer.NickName = nickName;
            
            await context.SaveChangesAsync();
            return newPlayer;
        }

        public async Task<int> DecreaseTimer(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            quiz.CurrentQuestionTime -= 1;
            await context.SaveChangesAsync();
            return quiz.CurrentQuestionTime;
        }

        public async Task SetTimer(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            quiz.CurrentQuestionTime = quiz.QuestionStartTime;
            await context.SaveChangesAsync();
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

        public async Task<List<TopPlayer>> GetTopPlayersCurrentQuestion(int quizId)
        {
            QuizInstance quiz = await context.QuizInstances.FindAsync(quizId);
            List<TopPlayer> topPlayers = new List<TopPlayer>();
            var answers = await context.AnswerInstances.Where(a => a.QuestionId == quiz.CurrentQuestionId && a.QuizInstanceId == quiz.Id).OrderByDescending(x => x.Score).ToListAsync();
            answers = answers.Take(answers.Count < 3 ? answers.Count : 3).ToList();

            for (int i = 0; i < answers.Count; i++)
            {
                var player = await context.Players.FindAsync(answers[i].PlayerId);
                topPlayers.Add(new TopPlayer(player.NickName, answers[i].Score));
            }
            return topPlayers;
        }

        private async Task<QuizInstance> getQuiz(int quizId)
        {
            return await context.QuizInstances.FindAsync(quizId);
        }

        private int CalculateScore(int timeLeft, int InitTime)
        {
            double hanyados = Convert.ToDouble(timeLeft)/ InitTime;
            int eredmény = Convert.ToInt32(hanyados * 1000);
            return eredmény;
        }
        public async Task<bool> IsNameTaken(string pin, string nickName)
        {
            return await context.Players.Where(p => p.NickName == nickName && p.Pin == pin).AnyAsync();
        }

        public async Task RefreshQuizIdinPlayersTable(int quizId, string pin)
        {
            List<Player> players = await context.Players.Where(p => p.Pin == pin).ToListAsync();

            foreach (var player in players)
            {
                player.QuizInstanceId = quizId;
            }
            await context.SaveChangesAsync();
        }

    }
}
