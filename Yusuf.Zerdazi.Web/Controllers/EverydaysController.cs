using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Yusuf.Zerdazi.Web.Data;
using Yusuf.Zerdazi.Web.Models;
using Yusuf.Zerdazi.Web.ViewModels;
using Yusuf.Zerdazi.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Graph;
using System.Net.Http.Headers;
using System.Collections.Specialized;
using System.Net;
using System.IO;
using System.Net.Http;
using Microsoft.AspNetCore.Http;

namespace Yusuf.Zerdazi.Web.Controllers
{
    public class EverydaysController : Controller
    {
        private readonly UserManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public EverydaysController(ApplicationDbContext context, UserManager<ApplicationUser> signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }

        // GET: Everydays
        public IActionResult Index()
        {
            ViewData["ImageUrl"] = "https://content.zerdazi.com/everydays/";

            var Model = new EverydaysViewModel()
            {
                Everydays = _context.Everydays.OrderByDescending(e => e.Date)
                    .Include(e => e.Month.Themes)

                    .Include(e => e.Pieces)
                        .ThenInclude(e => e.Theme)
                    .Include(e => e.Pieces)
                        .ThenInclude(e => e.Source.Theme),
                Months = _context.Months.OrderByDescending(m => m.Start)
                    .Include(m => m.Themes),
                Themes = _context.Themes.Include(t => t.Medium)
            };

            return View(Model);
        }

        public async Task<IActionResult> Upload()
        {
            var dateString = HttpContext.Request.Query["date"];
            DateTime.TryParse(dateString, out DateTime date);
            var parsedDate = date != null ? date : DateTime.Now;
            ViewBag.Themes = new SelectList(await _context.Themes.ToListAsync(), "ID", "Title");
            return View(new EverydayUpload() { Date = date, Files = new List<PieceUpload>() { new PieceUpload() { Source = new SourceUpload() } } });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Upload(EverydayUpload everyday)
        {
            if (ModelState.IsValid) {
                var GraphClient = await GetGraphServiceClient();
                var Pieces = new List<Piece>();
                foreach(var file in everyday.Files)
                {
                    var dateString = everyday.Date.ToString("yyyy-MM-dd");
                    var fileURL = await FileUploader.UploadFile(GraphClient, file.File, dateString);
                    var sourceURL = file.Source.File != null ? await FileUploader.UploadFile(GraphClient, file.Source.File, dateString) : file.Source.URL;

                    Piece source = null;
                    if (sourceURL != null)
                    {
                        source = new Piece()
                        {
                            Title = file.Source.Title,
                            Theme = _context.Themes.Where(x => x.ID == file.Theme.ID).Single(),
                            URL = sourceURL
                        };
                        _context.Pieces.Add(source);
                    }

                    var piece = new Piece()
                    {
                        Source = source,
                        Theme = _context.Themes.Where(x => x.ID == file.Theme.ID).Single(),
                        Title = file.Title,
                        URL = fileURL
                    };
                    Pieces.Add(piece);
                }
                _context.Pieces.AddRange(Pieces);
                _context.Everydays.Add(new Everyday()
                {
                    Date = everyday.Date,
                    Month = _context.Months.Where(x => x.Start.Month == everyday.Date.Month).Single(),
                    Pieces = Pieces
                });
                await _context.SaveChangesAsync();
                return RedirectToAction("/");
            } else
            {
                return View(everyday);
            }
        }

        private async Task<IGraphServiceClient> GetGraphServiceClient()
        {
            var user = await _signInManager.GetUserAsync(HttpContext.User);
            var externalAccessToken = await _signInManager.GetAuthenticationTokenAsync(user, "Microsoft", "access_token");
            var graphClient = new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    (requestMessage) =>
                    {
                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", externalAccessToken);
                        return Task.FromResult(0);
                    }));
            return graphClient;
        }

        private async Task<HttpResponseMessage> GetAccessToken()
        {
            var client = new HttpClient();
            var response = await client.PostAsync("https://login.live.com/oauth20_authorize.srf",
                new FormUrlEncodedContent(new List<KeyValuePair<string, string>>(){
                    new KeyValuePair<string,string>("application/x-www-form-urlencoded", "grant_type=client_credentials&client_id=" + "aa903d6d-44e5-4108-9770-02e40cfdb4c8" + "&client_secret=" + "awpbTFDZ927[!tsnTFO60*(" )
                    })
            );
            return response;
        }

        private bool EverydayExists(int id)
        {
            return _context.Everydays.Any(e => e.ID == id);
        }
    }
}
