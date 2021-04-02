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

        public async Task JoinGroup(string pin,string nickName)
        {
           string userEmail = GetUser();
           await quizRepository.CreatePlayerAsync(userEmail, nickName);
           await Groups.AddToGroupAsync(Context.ConnectionId, pin);
           await Clients.Groups(pin).RenderNewPlayer(nickName);
        }

        public async Task StartGame(int studiorumId, string pin)
        {
            string userEmail = GetUser();
            var quizId = await this.quizRepository.CreateQuizAsync(studiorumId);
            var firstQuestion = await quizRepository.GetQuestionAsync(quizId);

            // making sure we do not send to the client side which answer is correct
            foreach (var answer in firstQuestion.Answers)
                answer.IsCorrect = false;
            await Clients.Group(pin).ReceiveQuizId(quizId,firstQuestion);
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
                case QuizState.Quizresult:
                    var topPlayers = await quizRepository.GetTopPlayersAsync(quizId);
                    await Clients.Caller.ReceiveFinalResults(topPlayers);
                    break;
            }
        }

        public async Task<int[]> submitAnswer(int quizId, int answerId,string nickName)
        {
            Console.WriteLine(Context.ConnectionId);
            (Answer correctAnswer,int Score) result = await quizRepository.SubmitAnswerAsync(quizId, answerId, nickName);
             return new int[] { result.correctAnswer.Id, result.Score };
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
