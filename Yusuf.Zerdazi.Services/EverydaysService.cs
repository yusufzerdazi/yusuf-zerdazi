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

        public async Task<PieceDto> GetPieceAsync(int id, bool showExplicit = false)
        {
            var piece = await _context.Pieces
                .Include(p => p.Theme)
                .Select(p => Mapper.Map<PieceDto>(p))
                .SingleAsync(e => e.Id == id);
            piece.Filter(showExplicit);
            return piece;
        }

        public async Task<IList<MonthDto>> GetAllMonthsAsync()
        {
            var months = await GetMonths()
                .Select(m => Mapper.Map<MonthDto>(m))
                .ToListAsync();
            foreach(var month in months)
            {
                month.Order();
                month.Filter();
            }
            return months;
        }

        public async Task<MonthDto> GetMonthAsync(DateTime start)
        {
            var month = await GetMonths()
                .Where(m => m.Start == start)
                .Select(m => Mapper.Map<MonthDto>(m))
                .SingleAsync();
            month.Order();
            month.Filter();
            return month;
        }

        public async Task<MonthDto> GetMonthFromEnd(int i)
        {
            var startDate = (await GetMonths().LastAsync()).Start.AddMonths(-i);
            return await GetMonthAsync(startDate);
        }

        private IQueryable<Month> GetMonths()
        {
            return _context.Months
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(e => e.Source)
                .Include(m => m.Everydays).ThenInclude(e => e.Pieces).ThenInclude(p => p.Theme)
                .Where(m => m.Everydays.Any())
                .OrderBy(m => m.Start);
        }
    }
}
