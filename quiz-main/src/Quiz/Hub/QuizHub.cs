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

        public async Task GetQuizPin(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).ReceiveMessage(11,"ez a quizID");
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
