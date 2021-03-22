using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quiz.Data;
using Quiz.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudiorumController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public StudiorumController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Studiorum
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Studiorum>>> GetStudiorum()
        {
            ApplicationUser user = await GetUser();
            return await _context.Studiorums.Where(s => s.Owners.Contains(user)).Include(s => s.Questions).ToListAsync();
        }

        // GET: api/Studiorums/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Studiorum>> GetStudiorum(int id)
        {

            var studiorum = await _context.Studiorums
                .Include(s => s.Questions).ThenInclude(q => q.Answers)
                .SingleOrDefaultAsync(s => s.Id == id);

            if (studiorum == null)
            {
                return NotFound();
            }

            return studiorum;
        }

        // POST: api/Studiorum
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Studiorum>> PostStudiorum(Studiorum studiorum)
        {

            var newStudiorum = studiorum;
            var user = await GetUser();
            var owners = new List<ApplicationUser>();
            owners.Add(user);
            newStudiorum.Owners = owners;
            _context.Studiorums.Add(newStudiorum);
            user.Studiorums.Add(newStudiorum);
            await _context.SaveChangesAsync();
            return newStudiorum;
        }

        // DELETE: api/Studiorum/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Studiorum>> DeleteStudiorum(int id)
        {
            var studiorum = await _context.Studiorums.Include(s => s.Questions).SingleOrDefaultAsync(studiorum => studiorum.Id == id);
            if (studiorum == null)
                return NotFound();
            
               var questions = studiorum.Questions.ToList();
            if (questions != null || questions.Count != 0)
                _context.Questions.RemoveRange(questions);

            _context.Studiorums.Remove(studiorum);

            await _context.SaveChangesAsync();

            return studiorum;
        }

        private async Task<ApplicationUser> GetUser()
        {
            var access_token = "";
            var user = HttpContext.User.Identity;
            var claims = HttpContext.User.Claims.ToList();
            foreach (var claim in claims)
            {
                if (claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
                    access_token = claim.Value;
            }
            var applicationUser = await _context.Users.Where(u => u.Id == access_token).Include(u => u.Studiorums).SingleOrDefaultAsync();

            return applicationUser;
        }
    }
}
