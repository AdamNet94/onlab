using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Quiz.Models;
using Quiz.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;


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
       public async Task JoinGroupAdmin(string pin, string nickName)
       {
          await Groups.AddToGroupAsync(Context.ConnectionId, pin);
       }

        public async Task<bool> JoinGroup(string pin,string nickName)
        {
            if (await quizRepository.IsNameTaken(pin, nickName))
                return true;
            else
            {
                string userEmail = GetUser();
                await Groups.AddToGroupAsync(Context.ConnectionId, pin);
                //quizId is 0 at this point, it will be refreshed once the quiz starts
                await quizRepository.CreatePlayerAsync(GetUser(), nickName, 0, pin);
                await Clients.Groups(pin).RenderNewPlayer(nickName);
                return false;
            }            

        }
          
        public async Task StartGame(int studiorumId, string pin)
        {
            var quizId = await this.quizRepository.CreateQuizAsync(studiorumId);
            var firstQuestion = await quizRepository.GetQuestionAsync(quizId);
            await quizRepository.RefreshQuizIdinPlayersTable(quizId, pin);

            // making sure we do not send to the client side which answer is correct
            foreach (var answer in firstQuestion.Answers)
                answer.IsCorrect = false;
            await Clients.Group(pin).ReceiveQuizId(quizId,firstQuestion);
        }

        public async Task CreatePlayer(int quizId,string nickName,string pin)
        {
            await quizRepository.CreatePlayerAsync(GetUser(), nickName, quizId,pin);
        }

        public async Task SkipQuestionOnPlayers(string pin)
        {
            await Clients.Group(pin).SkipQuestion();
        }

        private async Task LateJoin(int quizId, string pin)
        {

        }


        public async Task Next(int quizId, string pin)
        {
            QuizState state = await quizRepository.GetStateAsync(quizId);
            switch (state)
            {
                case QuizState.Showquestion:
                        Question currentQuestion = await this.quizRepository.GetQuestionAsync(quizId);
                    if (currentQuestion == null)
                            goto case QuizState.Quizresult;
                        //making sure we do not send to the client side which answer is the correct one
                        foreach (var answer in currentQuestion.Answers)
                            answer.IsCorrect = false;
                        await Clients.Group(pin).ShowQuestion(currentQuestion);
                        break;
                case QuizState.Showanswer:
                        Answer correctAnswer = await this.quizRepository.GetCorrectAnswerAsync(quizId);
                        List<AnswerStat> stats = await this.quizRepository.GetAnswerSats(quizId);
                        await Clients.Caller.ReceiveCorrectAnswer(correctAnswer,stats);
                        break;

                case QuizState.Questionresult:
                        var topPlayersOfCurrentRound = await quizRepository.GetTopPlayersCurrentQuestion(quizId);
                        await Clients.Caller.ReceiveAnswerResults(topPlayersOfCurrentRound, false);
                        break;
                case QuizState.Quizresult:
                        var topPlayers = await quizRepository.GetTopPlayersAsync(quizId);
                        await Clients.Caller.ReceiveAnswerResults(topPlayers,true);
                        break;
            }
        }

        public async Task<int> GetAnswerScore(int quizId)
        {
            return await quizRepository.getUserAnswerResultAsync(GetUser(), quizId);
        }

        public async Task SubmitAnswer(int quizId, AnswerSubmit answerSubmit,string pin)
        {
            string userId = GetUser();
            await quizRepository.SubmitAnswerAsync(quizId, answerSubmit, userId);
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
