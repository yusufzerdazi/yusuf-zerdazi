using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Data.Models;

namespace Yusuf.Zerdazi.Services
{
    public interface IEverydaysService
    {
        Task<IList<Everyday>> GetAllEverydays();
        Task<IList<Month>> GetAllMonths();
        Task<Month> GetMonth(DateTime start);
        Task<IList<Piece>> GetAllPieces();
        Task<IList<Piece>> GetPiecesForMonth(Month month);
        Task<IList<Month>> GetMonthForDate(DateTime date);
    }
}