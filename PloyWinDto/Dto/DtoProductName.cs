﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PloyWinDto.Dto
{
    public class DtoProductName
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string ImgURL { get; set; }
        public IFormFile fileUpload { get; set; }
    }
}
