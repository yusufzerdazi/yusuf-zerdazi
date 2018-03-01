using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yusuf.Zerdazi.Data.Models
{
    public class Everyday
    {
        public Everyday()
        {

        }
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public ICollection<Piece> Pieces { get; set; }
    }
}