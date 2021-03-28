﻿using Microsoft.AspNetCore.Mvc;
using Quiz.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Quiz.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace Quiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService quizService;
        UserManager<ApplicationUser> _userManager;

        public QuizController(IQuizService qs, UserManager<ApplicationUser> userManager)
        {
            quizService = qs;
            _userManager = userManager;
        }

        [HttpGet]
        public string getTokenFromHeader()
        {
            StringValues values;
            var re = Request;
            var header = re.Headers;
            bool successfull = header.TryGetValue("Authorization", out values);
            string auth = values.ToString();
            auth = JsonConvert.SerializeObject(auth);
            if (successfull)
                return auth;
            return "";
        }

        [HttpGet("next/{id}")]
        public void Next(int id)    
        {
            quizService.Next(id);
        }

        [HttpPost]
        public async void SetAnswer(int[] parameters)
        {
            // 1.proba
            var name = HttpContext.User.Identity.Name;
            //2.proba
            var User = HttpContext.User;
            ApplicationUser applicationUser = await _userManager.GetUserAsync(User);
            string userEmail = applicationUser?.Email;
            //, HubConnectionContext connectionContext => , connectionContext.UserIdentifier
            quizService.SetAnswer(parameters[0], parameters[1], parameters[2], "dummyUser");
        }

        public class AnswerSubmit
        {
            public int quizId { get; }
            public int questionId { get; }
            public int answerId { get; }
        }

    }

}
