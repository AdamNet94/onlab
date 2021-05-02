using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Quiz.Models;
using Quiz.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Timers;

namespace Quiz.Hub
{
    [Authorize(AuthenticationSchemes = "Identity.Application")]
    public class QuizHub : Hub<IQuizClient>
    {
        IQuizRepository quizRepository;

       public QuizHub(IQuizRepository repo)
       {
          this.quizRepository = repo;
       }
       public async Task<int> JoinGroupAdmin(int studiorumId,string pin,int quizTime)
       {
          await Groups.AddToGroupAsync(Context.ConnectionId, pin);
          int quizId = await quizRepository.CreateQuizAsync(studiorumId, pin, quizTime);
          return quizId;
       }

        public async Task<int> JoinGroup(string pin,string nickName)
        {
            if (await quizRepository.IsNameTaken(pin, nickName))
                return -1;
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, pin);
                int quizId = await quizRepository.getQuizId(pin);
                await quizRepository.CreatePlayerAsync(GetUser(), nickName, quizId, pin);
                await Clients.Groups(pin).RenderNewPlayer(nickName);

                if (await quizRepository.GetStateAsync(quizId) == QuizState.Showanswer)
                    await this.LateJoin(quizId);
                return quizId;
            }
        }
       
        public async Task CreatePlayer(int quizId,string nickName,string pin)
        {
            await quizRepository.CreatePlayerAsync(GetUser(), nickName, quizId,pin);
        }

        public async Task SkipQuestionOnPlayers(string pin)
        {
            await Clients.Group(pin).SkipQuestion();
        }

        private async Task LateJoin(int quizId)
        {
             Question currentQuestion = await this.quizRepository.GetCurrentQuestionAsync(quizId);
             removeCorrectFromQuestion(currentQuestion);
             await Clients.Caller.ShowQuestion(currentQuestion);
        }



        public async Task Next(int quizId, string pin)
        {
            Question currentQuestion = null;
            QuizState state = await quizRepository.GetStateAsync(quizId);
            switch (state)
            {
                case QuizState.Showquestion:
                        currentQuestion = await this.quizRepository.GetNextQuestionAsync(quizId);
                                               
                        if (currentQuestion == null)
                            goto case QuizState.Quizresult;
                        //making sure to remove which asnwer is correct
                        removeCorrectFromQuestion(currentQuestion);
                        Question questionWithOutAnswers = new Question();
                        questionWithOutAnswers.Answers = new List<Answer>();
                        questionWithOutAnswers.Text = currentQuestion.Text;
                        await Clients.Group(pin).PreviewQuestion(questionWithOutAnswers);
                        await quizRepository.ChangeQuizState(quizId, QuizState.Questionresult);
                        await quizRepository.SetTimer(quizId);
                        Timer timer = new Timer();
                        timer.Elapsed += (sender, e) => { sendQuestionWithAnswers(pin,quizId, currentQuestion); };
                        timer.Interval = 3000;
                        timer.AutoReset = false;
                        timer.Enabled = true;
                        await quizRepository.ChangeQuizState(quizId, QuizState.Showanswer);
                    break;
                case QuizState.Showanswer:
                        Answer correctAnswer = await this.quizRepository.GetCorrectAnswerAsync(quizId);
                        List<AnswerStat> stats = await this.quizRepository.GetAnswerSats(quizId);
                        await quizRepository.ChangeQuizState(quizId, QuizState.Questionresult);
                        await Clients.Caller.ReceiveCorrectAnswer(correctAnswer,stats);
                        await Clients.Group(pin).InvokeGetAnswer();
                        break;
                case QuizState.Questionresult:
                        var topPlayersOfCurrentRound = await quizRepository.GetTopPlayersCurrentQuestion(quizId);
                        await quizRepository.ChangeQuizState(quizId, QuizState.Showquestion);
                        await Clients.Caller.ReceiveAnswerResults(topPlayersOfCurrentRound, false);
                        break;
                case QuizState.Quizresult:
                        var topPlayers = await quizRepository.GetTopPlayersAsync(quizId);
                        await Clients.Caller.ReceiveAnswerResults(topPlayers,true);
                        break;
            }
        }

        private void removeCorrectFromQuestion(Question question)
        {
            // we want to make sure we do not send the which answer is correct.
            foreach (var answer in question.Answers)
            {
                answer.IsCorrect = false;
            }

        }

        public async Task<int> CountDown(int quizId)
        {
            int timeRemained = await quizRepository.DecreaseTimer(quizId);
            return timeRemained;
        }

        private async Task sendQuestionWithAnswers(string pin,int quizId, Question questionWithAnswers)
        {
            Console.WriteLine("sendQuestionWithAnswers called ");
            await Clients.Group(pin).ShowQuestion(questionWithAnswers);
        }

        public async Task<int> GetAnswerScore(int quizId)
        {
            return await quizRepository.getUserAnswerResultAsync(GetUser(), quizId);
        }

        public async Task SubmitAnswer(int quizId,int answerId,string pin)
        {
            string userId = GetUser();
            await quizRepository.SubmitAnswerAsync(quizId, answerId, userId);
            await Clients.Group(pin).AnswerCountDecresed();
        }

        public async Task<List<TopPlayer>> CurrentQuestionTopPlayers(int quizId)
        {
            List<TopPlayer> topPlayersOfCurrentRound = await quizRepository.GetTopPlayersCurrentQuestion(quizId);
            return topPlayersOfCurrentRound;
        }

        private string GetUser()
        {
            var userIdentities = Context.User.Identities;
            string userEmail = "";
            foreach (var ident in userIdentities)
            {
                if (ident.NameClaimType == "name")
                    userEmail = ident.Name;
            }
            return userEmail;
        }

    }
}
