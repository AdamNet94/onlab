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
        private readonly IServiceScopeFactory scopeFactory;
        QuizRepository quizRepository;
        Random r = new Random();
        public QuizHub(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
            var scope = scopeFactory.CreateScope();
            this.quizRepository = new QuizRepository
                (scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
        }   

        public static HubRoom Lobby { get; } = new HubRoom
        { 
            Name = "QuizRoom";
        };

        public async Task getQuizPin(int studiorumId)
        {
            //return await Clients.Caller.SendAsync("receive", user, message);
        }

        public class HubRoom
        {
            public string Name { get; set; }
            public List<User> users = new List<User>();
        }

        public async Task EnterLobby()
        {
            var user = new User
            {
                UserId = r.Next(0,100).ToString(),
                Name = "user"+r.Next(0,100)
            };

            Lobby.users.Add(user);
            await Clients.Others.UserJoined(user);
            await Clients.All.SetUsers(Lobby.users);
            
        }

        public async Task Start()
        {
            
            await Clients.All.StartGame();
        }

        public async Task ShowAnswer(int questionId)
        {

        }

        public async Task SendQuestion(Question q)
        {
            Console.WriteLine();
            Console.WriteLine("Calling ShowQuestion with id: "+q.Id);
            await Clients.All.ShowQuestion(q);
        }

        public async Task EndGame()
        {
            await Clients.All.ShowResults();
        }
    }
}
