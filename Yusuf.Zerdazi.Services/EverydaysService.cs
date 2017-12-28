using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Data;
using Yusuf.Zerdazi.Data.Models;

namespace Yusuf.Zerdazi.Services
{
    public class EverydaysService : IEverydaysService
    {
        private readonly ApplicationDbContext _context;

        public EverydaysService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IList<Everyday>> GetAllEverydays()
        {
            var everydays = await _context.Everydays
                .Include(e => e.Pieces)
                .ToListAsync();
            return everydays;
        }

        public async Task<IList<Month>> GetAllMonths()
        {
            var months = await _context.Months
                .Include(m => m.Everydays)
                    .ThenInclude(e => e.Pieces)
                    .ThenInclude(e => e.Source)
                .Include(m => m.Themes)
                .Where(m => m.Everydays.Any())
                .OrderByDescending(m => m.Start)
                .ToListAsync();
            months.ForEach(m => m.Everydays = m.Everydays.OrderByDescending(e => e.Date).ToArray());
            return months;
        }

        public async Task<Month> GetMonth(DateTime start)
        {
            var month = await _context.Months
                .Include(m => m.Everydays)
                    .ThenInclude(e => e.Pieces)
                    .ThenInclude(e => e.Source)
                .Include(m => m.Themes)
                .Where(m => m.Start == start)
                .Where(m => m.Everydays.Any())
                .OrderByDescending(m => m.Start)
                .FirstOrDefaultAsync();

            if(month == null)
            {
                return month;
            }

            month.Everydays = month.Everydays.OrderByDescending(e => e.Date).ToArray();
            return month;
        }

        public async Task<IList<Piece>> GetAllPieces()
        {
            return await _context.Pieces.ToListAsync();
        }

        public async Task<IList<Piece>> GetPiecesForMonth(Month month)
        {
            return await _context.Months
                .Where(e => e == month)
                .Include(e => e.Everydays)
                    .ThenInclude(e => e.Pieces)
                .Select(m => m.Everydays
                    .Select(e => e.Pieces))
                .SelectMany(x => x)
                .SelectMany(x => x).ToListAsync();
        }

        public async Task<IList<Month>> GetMonthForDate(DateTime date)
        {
            var monthStart = date.AddDays(-date.Day + 1);
            return await _context.Months.Where(m => m.Start == monthStart).ToListAsync();
        }
    }
}
