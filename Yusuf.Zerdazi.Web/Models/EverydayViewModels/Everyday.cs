using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yusuf.Zerdazi.Web.Models
{
    public class Everyday
    {
        public Everyday()
        {

        }
        [Key]
        public int ID { get; set; }
        public virtual Month Month { get; set; }
        public DateTime Date { get; set; }
        public ICollection<Piece> Pieces { get; set; }
    }
}
