using System;
using System.Collections.Generic;

namespace Yusuf.Zerdazi.Shared.Dtos
{
    public class EverydayDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public List<PieceDto> Pieces { get; set; }
    }
}