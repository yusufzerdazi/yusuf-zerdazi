using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Data;
using Yusuf.Zerdazi.Data.Models;
using Yusuf.Zerdazi.Shared.Dtos;

namespace Yusuf.Zerdazi.Services
{
    public class EverydaysService : IEverydaysService
    {
        private readonly ApplicationDbContext _context;

        public EverydaysService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IList<EverydayDto>> GetAllEverydays()
        {
            var everydays = await _context.Everydays
                .Include(e => e.Pieces).ThenInclude(p => p.Theme)
                .Select(e => Mapper.Map<EverydayDto>(e))
                .ToListAsync();
            return everydays;
        }

        public async Task<IList<MonthDto>> GetAllMonths()
        {
            var months = await _context.Months
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(e => e.Source)
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(p => p.Theme)
                .Where(m => m.Everydays.Any())
                .OrderByDescending(m => m.Start)
                .Select(m => Mapper.Map<MonthDto>(m))
                .ToListAsync();

            months.ForEach(m => m.Everydays = m.Everydays
                .OrderByDescending(e => e.Date)
                .ToList()
            );

            foreach(var month in months)
            {
                foreach(var everyday in month.Everydays)
                {
                    everyday.Pieces.OrderByDescending(p => p.Theme);
                    foreach(var piece in everyday.Pieces)
                    {
                        if (piece.Explicit)
                        {
                            piece.URL = null;
                        }
                    }
                }
            }

            return months;
        }

        public async Task<MonthDto> GetMonth(DateTime start)
        {
            var month = await _context.Months
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(e => e.Source)
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(p => p.Theme)
                .Where(m => m.Start == start)
                .OrderByDescending(m => m.Start)
                .Select(m => Mapper.Map<MonthDto>(m))
                .SingleAsync();

            if(month == null)
            {
                return month;
            }

            month.Everydays = month.Everydays.OrderByDescending(e => e.Date).ToList();

            foreach (var everyday in month.Everydays)
            {
                foreach (var piece in everyday.Pieces)
                {
                    if (piece.Explicit)
                    {
                        piece.URL = null;
                    }
                }
            }

            return month;
        }

        public async Task<IList<PieceDto>> GetAllPieces()
        {
            return await _context.Pieces
                .Select(p => Mapper.Map<PieceDto>(p))
                .ToListAsync();
        }

        public async Task<IList<PieceDto>> GetPiecesForMonth(Month month)
        {
            return await _context.Months
                .Where(e => e == month)
                .Include(m => m.Everydays)
                    .ThenInclude(e => e.Pieces)
                    .ThenInclude(p => p.Theme)
                .Select(m => m.Everydays
                    .Select(e => e.Pieces))
                .SelectMany(x => x)
                .SelectMany(x => x)
                .Select(p => Mapper.Map<PieceDto>(p))
                .ToListAsync();
        }

        public async Task<MonthDto> GetMonthForDate(DateTime date)
        {
            var monthStart = date.AddDays(-date.Day + 1);
            return await GetMonth(monthStart);
        }

        public async Task<MonthDto> GetMonthFromEnd(int i)
        {
            return await GetMonthForDate((await _context.Everydays.OrderByDescending(e => e.Date)
                .FirstAsync()).Date.AddMonths(-i));
        }
    }
}
