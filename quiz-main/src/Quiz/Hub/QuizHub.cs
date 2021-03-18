using Microsoft.AspNetCore.SignalR;
using Quiz.Models;
using Quiz.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;

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
           await quizRepository.AddUserAsync(Context.ConnectionId, user);
           await Groups.AddToGroupAsync(Context.ConnectionId, pin);
           await Clients.Groups(pin).RenderNewPlayer(user);
        }

        public async Task StartGame(int studiorumId, string pin)
        {
            var quizId = await this.quizRepository.CreateQuizAsync(studiorumId);
            var firstQuestion = await quizRepository.GetQuestionAsync(quizId);

            // making sure we do not send to the client side which answer is correct
            foreach (var answer in firstQuestion.Answers)
            {
                answer.IsCorrect = false;
            }
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
                case QuizState.Questionresult:break;

                case QuizState.Quizresult:break;
            }
        }

        public async Task<int[]> submitAnswer(int quizId, int answerId)
        {
            (Answer correctAnswer,int Score) result = await quizRepository.submitAnswerAsync(quizId, answerId,Context.ConnectionId);
            return new int[] { result.correctAnswer.Id, result.Score };
        }
    }
}
