using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Web.Models;

namespace Yusuf.Zerdazi.Web.ViewModels
{
    public class PieceUpload
    {
        public PieceUpload()
        {

        }
        [Required]
        public string Title { get; set; }
        [Required]
        public Theme Theme { get; set; }
        public string URL { get; set; }
        [Required]
        public IFormFile File { get; set; }
        public SourceUpload Source { get; set; }
    }

    public class SourceUpload
    {
        public SourceUpload()
        {

        }
        public string Title { get; set; }
        public string URL { get; set; }
        public IFormFile File { get; set; }
    }
}
