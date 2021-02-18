using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Quiz.Models;
using System;
using System.Linq;

namespace Quiz.Data
{

    public class SeedData
    {
        public static void SeedDb(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(serviceProvider.
                GetRequiredService<DbContextOptions>(),
                serviceProvider.GetRequiredService<IOptions<OperationalStoreOptions>>()))
            {
                if (context.Questions.Any())
                    return;

                var q1 = new Question { Name = "Mitológia", Text = "Kinek a gyermeke volt Pégaszosz(Pegazus) a szárnyas ló a görög mitológiában?" };
                var q2 = new Question { Name = "Sport", Text = "Ki nem tagja a '92-es Dream Teamnek?" };
                var q3 = new Question { Name = "Politika", Text = "Ki nevezett kit a legynagyobb magyarnak?" };
                
                context.Questions.AddRange
                    (
                    q1,q2,q3
                    );

                context.SaveChanges();

                context.Answers.AddRange(
               new Answer { QuestionID = q1.Id, Name = "Poszeidón és Medusza", IsCorrect = true },
               new Answer { QuestionID = q1.Id, Name = "Gaia és Uranosz", IsCorrect = false },
               new Answer { QuestionID = q1.Id, Name = "A nimfák gyermeke", IsCorrect = false },
               new Answer { QuestionID = q1.Id, Name = "A titánok gyermeke", IsCorrect = false },
               new Answer { QuestionID = q2.Id, Name = "Michael Jordan", IsCorrect = false },
               new Answer { QuestionID = q2.Id, Name = "Magic Johnson", IsCorrect = false },
               new Answer { QuestionID = q2.Id, Name = "Larry Bird", IsCorrect = false },
               new Answer { QuestionID = q2.Id, Name = "Lebron James", IsCorrect = true },
               new Answer { QuestionID = q3.Id, Name = "Kossuth Lajos Széchenyi Istvánt", IsCorrect = true },
               new Answer { QuestionID = q3.Id, Name = "Széchenyi István Kossuth Ferencet", IsCorrect = false },
               new Answer { QuestionID = q3.Id, Name = "Gyurcsány Ferenc Orbán Viktort", IsCorrect = false },
               new Answer { QuestionID = q3.Id, Name = "Orbán Lajos Gyurcsány Istvánt", IsCorrect = false }
                   );
                context.SaveChanges();
            }
        }
    }
}
