using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Data.Migrations
{
    public partial class DataSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Name", "Text" },
                values: new object[] { 1, "Mitológia", "Kinek a gyermeke volt Pégaszosz(Pegazus) a szárnyas ló a görög mitológiában?" });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Name", "Text" },
                values: new object[] { 2, "Sport", "Ki nem tagja a '92-es Dream Teamnek?" });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Name", "Text" },
                values: new object[] { 3, "Politika", "Ki nevezett kit a legynagyobb magyarnak?" });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "IsCorrect", "Name", "QuestionID" },
                values: new object[,]
                {
                    { 1, true, "Poszeidón és Medusza", 1 },
                    { 2, false, "Gaia és Uranosz", 1 },
                    { 3, false, "A nimfák gyermeke", 1 },
                    { 4, false, "A titánok gyermeke", 1 },
                    { 5, false, "Michael Jordan", 2 },
                    { 6, false, "Magic Johnson", 2 },
                    { 7, false, "Larry Bird", 2 },
                    { 8, true, "Lebron James", 2 },
                    { 9, true, "Kossuth Lajos Széchenyi Istvánt", 3 },
                    { 10, false, "Széchenyi István Kossuth Ferencet", 3 },
                    { 11, false, "Gyurcsány Ferenc Orbán Viktort", 3 },
                    { 12, false, "Orbán Lajos Gyurcsány Istvánt", 3 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Answers",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
