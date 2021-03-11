
namespace Quiz.Models
{
    public class AnswerInstance
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
        public int Score { get; set; }
        public bool IsCorrect { get; set; }
        public int PlayerId { get; set; }
        public int QuizInstanceId {get;set; }
        public QuizInstance Quiz { get; set; }
        public Player Player { get; set; }
    }
}
