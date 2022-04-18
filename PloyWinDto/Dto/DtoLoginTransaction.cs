using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PloyWinDto.Dto
{
    public class DtoLoginTransaction
    {
        public int id { get; set; }
        public string userType { get; set; }
        public string accountName { get; set; }
        public string governorate { get; set; }
        public string phone { get; set; }
        public string loginDate { get; set; }
    }
}
