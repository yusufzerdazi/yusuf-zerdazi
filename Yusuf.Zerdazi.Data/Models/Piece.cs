using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yusuf.Zerdazi.Data.Models
{
    public class Piece
    {
        public Piece()
        {

        }

        [Key]
        public int ID { get; set; }
        public Theme Theme { get; set; }
        public string Title { get; set; }
        public string URL { get; set; }
        public Piece Source { get; set; }
    }
}
