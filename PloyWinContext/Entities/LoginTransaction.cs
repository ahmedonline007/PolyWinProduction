using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PloyWinContext.Entities
{
    //جدول خاص بتسجيل عمليات الدخول
    public class LoginTransaction : BaseEntity
    {
        // نوع الحساب
        public int? TypeAccount { get; set; }
        //اسم الاكونت
        public string AccountName { get; set; }
        // المحافظة
        public string Governorate { get; set; }
        //رقم التليفون
        public string Phone { get; set; }
    }
}
