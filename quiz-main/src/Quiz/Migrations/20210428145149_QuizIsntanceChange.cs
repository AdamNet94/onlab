using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Migrations
{
    public partial class QuizIsntanceChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentQuestionTime",
                table: "QuizInstances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Pin",
                table: "QuizInstances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionStartTime",
                table: "QuizInstances",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentQuestionTime",
                table: "QuizInstances");

            migrationBuilder.DropColumn(
                name: "Pin",
                table: "QuizInstances");

            migrationBuilder.DropColumn(
                name: "QuestionStartTime",
                table: "QuizInstances");
        }
    }
}
