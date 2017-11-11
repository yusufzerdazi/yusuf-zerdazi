using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Yusuf.Zerdazi.Web.ViewModels
{
    public class EverydayUpload
    {
        public EverydayUpload()
        {

        }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public List<PieceUpload> Files { get; set; }
    }
}
