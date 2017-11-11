using Microsoft.AspNetCore.Http;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Web.Models;

namespace Yusuf.Zerdazi.Web.Services
{
    public static class FileUploader
    {
        private static readonly string IMAGES_FOLDER = "images";
        private static readonly string SOUND_FOLDER = "audio";

        public async static Task<string> UploadFile(IGraphServiceClient graphServiceClient, IFormFile file, string title)
        {
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var folderName = GetFileType(fileName);
            var uploadedFilePath = "Shared\\everydays\\" + folderName + "\\" + title + "." + fileName.Split(".").Last();
            var uploadedFile = await graphServiceClient.Me.Drive.Root.ItemWithPath(uploadedFilePath).Content.Request().PutAsync<DriveItem>(file.OpenReadStream());
            var permission = await graphServiceClient.Me.Drive.Root.ItemWithPath(uploadedFilePath).CreateLink("view", "anonymous").Request().PostAsync();
            var shareURL = permission.Link.WebUrl;
            string base64Value = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(shareURL));
            string encodedUrl = "u!" + base64Value.TrimEnd('=').Replace('/', '_').Replace('+', '-');
            string resultUrl = string.Format("https://api.onedrive.com/v1.0/shares/{0}/root/content", encodedUrl);
            return resultUrl;
        }

        private static string GetFileType(string fileName)
        {
            if (fileName.EndsWith(".mp3"))
            {
                return SOUND_FOLDER;
            } else if (fileName.EndsWith(".jpg"))
            {
                return IMAGES_FOLDER;
            } else
            {
                throw new NotSupportedException("The file type uploaded was not supported.");
            }
        }
    }
}
