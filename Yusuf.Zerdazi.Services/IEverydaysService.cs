using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Data.Models;
using Yusuf.Zerdazi.Shared.Dtos;

namespace Yusuf.Zerdazi.Services
{
    public interface IEverydaysService
    {
        Task<PieceDto> GetPieceAsync(int id, bool showExplicit = false);
        Task<IList<MonthDto>> GetAllMonthsAsync();
        Task<MonthDto> GetMonthAsync(DateTime start);
        Task<MonthDto> GetMonthFromEnd(int i);
    }
}