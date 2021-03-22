using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Quiz.Models
{
    public class ApplicationUser: IdentityUser
    {
        public virtual ICollection<Studiorum> Studiorums { get; set; }

    }
}
