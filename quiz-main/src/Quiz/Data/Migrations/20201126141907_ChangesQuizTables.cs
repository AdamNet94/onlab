using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Data.Migrations
{
    public partial class ChangesQuizTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnswerInstances_User_UserId",
                table: "AnswerInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizInstances_AnswerInstances_AnswerInstanceId",
                table: "QuizInstances");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_QuizInstances_AnswerInstanceId",
                table: "QuizInstances");

            migrationBuilder.DropIndex(
                name: "IX_AnswerInstances_UserId",
                table: "AnswerInstances");

            migrationBuilder.DropColumn(
                name: "AnswerInstanceId",
                table: "QuizInstances");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AnswerInstances");

            migrationBuilder.AddColumn<int>(
                name: "QuizInstanceId",
                table: "AnswerInstances",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "AnswerInstances",
                nullable: true);

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
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "User",
                table: "AnswerInstances");

            migrationBuilder.AddColumn<int>(
                name: "AnswerInstanceId",
                table: "QuizInstances",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "AnswerInstances",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizInstances_AnswerInstanceId",
                table: "QuizInstances",
                column: "AnswerInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerInstances_UserId",
                table: "AnswerInstances",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnswerInstances_User_UserId",
                table: "AnswerInstances",
                column: "UserId",
                principalTable: "User",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuizInstances_AnswerInstances_AnswerInstanceId",
                table: "QuizInstances",
                column: "AnswerInstanceId",
                principalTable: "AnswerInstances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
