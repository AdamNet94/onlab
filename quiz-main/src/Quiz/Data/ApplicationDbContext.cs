using Quiz.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<QuizInstance> QuizInstances { get; set; }
        public DbSet<AnswerInstance> AnswerInstances { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region QuestionSeed
            modelBuilder.Entity<Question>().HasData(new Question { Id = 1, Name = "Mitológia", Text= "Kinek a gyermeke volt Pégaszosz(Pegazus) a szárnyas ló a görög mitológiában?" });
            modelBuilder.Entity<Question>().HasData(new Question { Id = 2, Name = "Sport", Text= "Ki nem tagja a '92-es Dream Teamnek?" });
            modelBuilder.Entity<Question>().HasData(new Question { Id = 3, Name = "Politika", Text= "Ki nevezett kit a legynagyobb magyarnak?"});
            #endregion

            #region AnswerSeed
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 1, QuestionID = 1, Name = "Poszeidón és Medusza", IsCorrect = true });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 2, QuestionID = 1, Name = "Gaia és Uranosz", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 3, QuestionID = 1, Name = "A nimfák gyermeke", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 4, QuestionID = 1, Name = "A titánok gyermeke", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 5, QuestionID = 2, Name = "Michael Jordan", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 6, QuestionID = 2, Name = "Magic Johnson", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 7, QuestionID = 2, Name = "Larry Bird", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 8, QuestionID = 2, Name = "Lebron James", IsCorrect = true });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 9, QuestionID = 3, Name = "Kossuth Lajos Széchenyi Istvánt", IsCorrect = true });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 10, QuestionID = 3, Name = "Széchenyi István Kossuth Ferencet", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 11, QuestionID = 3, Name = "Gyurcsány Ferenc Orbán Viktort", IsCorrect = false });
            modelBuilder.Entity<Answer>().HasData(new Answer() { Id = 12, QuestionID = 3, Name = "Orbán Lajos Gyurcsány Istvánt", IsCorrect = false });
            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}
