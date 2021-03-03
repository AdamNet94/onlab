using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Data.Migrations
{
    public partial class Studiorum1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnswerInstances_QuizInstances_QuizInstanceId",
                table: "AnswerInstances");

            migrationBuilder.DropIndex(
                name: "IX_AnswerInstances_QuizInstanceId",
                table: "AnswerInstances");

            migrationBuilder.DropColumn(
                name: "QuizInstanceId",
                table: "AnswerInstances");

            migrationBuilder.AddColumn<int>(
                name: "QuizId",
                table: "AnswerInstances",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnswerInstances_QuizId",
                table: "AnswerInstances",
                column: "QuizId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnswerInstances_QuizInstances_QuizId",
                table: "AnswerInstances",
                column: "QuizId",
                principalTable: "QuizInstances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnswerInstances_QuizInstances_QuizId",
                table: "AnswerInstances");

            migrationBuilder.DropIndex(
                name: "IX_AnswerInstances_QuizId",
                table: "AnswerInstances");

            migrationBuilder.DropColumn(
                name: "QuizId",
                table: "AnswerInstances");

            migrationBuilder.AddColumn<int>(
                name: "QuizInstanceId",
                table: "AnswerInstances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AnswerInstances_QuizInstanceId",
                table: "AnswerInstances",
                column: "QuizInstanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnswerInstances_QuizInstances_QuizInstanceId",
                table: "AnswerInstances",
                column: "QuizInstanceId",
                principalTable: "QuizInstances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
