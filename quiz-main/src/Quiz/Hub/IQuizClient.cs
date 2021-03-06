﻿using Quiz.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quiz.Hub
{
    public interface IQuizClient
    {
        Task RenderNewPlayer(string user);
        Task ReceiveQuizId(int quizId);
        Task ShowQuestion(Question q);
        Task PreviewQuestion(Question q);
        Task ReceiveCorrectAnswer(Answer correctAnswer, List<AnswerStat> stats);
        Task ReceiveAnswerResults(List<TopPlayer> topPlayers, bool isFinalResults);
        Task AnswerCountDecresed();
        Task SkipQuestion();
        Task InvokeGetAnswer();


        Task TimerCallBack();
        Task TimeDecreased(int timeRemained);
        Task ReceiveResult(int correctAnswerId, int score);
        Task ShowQuestionResult();
        Task StartGame();
        Task Next();
        Task ShowResults();
    }
}
