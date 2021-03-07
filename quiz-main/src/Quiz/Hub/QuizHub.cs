using Microsoft.AspNetCore.SignalR;
using Quiz.Data;
using Quiz.Models;
using Quiz.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Quiz.Hub
{
    public class QuizHub : Hub<IQuizClient>
    {
        IQuizRepository quizRepository;
        Random r = new Random();
       public QuizHub(IQuizRepository repo)
         {
             this.quizRepository = repo;
         }

        public async Task JoinGroup(string pin,string user)
        {
           await Groups.AddToGroupAsync(Context.ConnectionId, pin);
           await Clients.Groups(pin).RenderNewPlayer(user);
        }

        public async Task StartGame(int studiorumId, string pin)
        {
            var quizId = await this.quizRepository.CreateQuizAsync(studiorumId);
            await Clients.Group(pin).ReceiveQuizId(quizId);
        }

        public async Task SetAnswer()
        {

        }

        public async Task SendQuestion()
        {

        }

        public async Task EndGame()
        {
            await Clients.All.ShowResults();
        }
    }
}
