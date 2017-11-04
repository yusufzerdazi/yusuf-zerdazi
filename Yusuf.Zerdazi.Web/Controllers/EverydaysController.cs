using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Yusuf.Zerdazi.Web.Data;
using Yusuf.Zerdazi.Web.Models;

namespace Yusuf.Zerdazi.Web.Controllers
{
    public class EverydaysController : Controller
    {
        private readonly EverydayContext _context;

        public EverydaysController(EverydayContext context)
        {
            _context = context;
        }

        // GET: Everydays
        public async Task<IActionResult> Index()
        {
            return View(await _context.Everydays.OrderByDescending(e => e.Date).ToListAsync());
        }

        // GET: Everydays/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var everyday = await _context.Everydays
                .SingleOrDefaultAsync(m => m.ID == id);
            if (everyday == null)
            {
                return NotFound();
            }

            return View(everyday);
        }

        // GET: Everydays/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Everydays/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Date,Title,OriginalAudio,OriginalImage,SourceImageTitle,SourceAudio")] Everyday everyday)
        {
            if (ModelState.IsValid)
            {
                _context.Add(everyday);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(everyday);
        }

        // GET: Everydays/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var everyday = await _context.Everydays.SingleOrDefaultAsync(m => m.ID == id);
            if (everyday == null)
            {
                return NotFound();
            }
            return View(everyday);
        }

        // POST: Everydays/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Date,Title,OriginalAudio,OriginalImage,SourceImageTitle,SourceAudio")] Everyday everyday)
        {
            if (id != everyday.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(everyday);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EverydayExists(everyday.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(everyday);
        }

        // GET: Everydays/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var everyday = await _context.Everydays
                .SingleOrDefaultAsync(m => m.ID == id);
            if (everyday == null)
            {
                return NotFound();
            }

            return View(everyday);
        }

        // POST: Everydays/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var everyday = await _context.Everydays.SingleOrDefaultAsync(m => m.ID == id);
            _context.Everydays.Remove(everyday);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EverydayExists(int id)
        {
            return _context.Everydays.Any(e => e.ID == id);
        }
    }
}
