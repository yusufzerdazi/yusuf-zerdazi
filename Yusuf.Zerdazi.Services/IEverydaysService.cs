using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Data.Models;
using Yusuf.Zerdazi.Shared.Dtos;

namespace Yusuf.Zerdazi.Services
{
    public interface IEverydaysService
    {
        Task<IList<EverydayDto>> GetAllEverydays();
        Task<IList<MonthDto>> GetAllMonths();
        Task<MonthDto> GetMonth(DateTime start);
        Task<IList<PieceDto>> GetAllPieces();
        Task<IList<PieceDto>> GetPiecesForMonth(Month month);
        Task<MonthDto> GetMonthForDate(DateTime date);
        Task<MonthDto> GetMonthFromEnd(int i);
    }
}