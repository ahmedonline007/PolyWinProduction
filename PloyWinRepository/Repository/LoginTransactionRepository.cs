using IPloyWinRepository.InterFace;
using Microsoft.EntityFrameworkCore;
using PloyWinContext.Context;
using PloyWinContext.Entities;
using PloyWinDto.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PloyWinRepository.Repository
{
    public class LoginTransactionRepository : GenericRepository<ApplicationContext, LoginTransaction>, ILoginTransactionRepository
    {
        public void AddLoginTransaction(LoginTransaction dto)
        {
            Add(dto);
            Save();
        }


        public List<DtoLoginTransaction> GetLoginTransactions()
        {
            var result = (from q in Context.LoginTransaction.AsNoTracking().Where(x => x.IsDeleted == null)
                          select new DtoLoginTransaction
                          {
                              id = q.Id,
                              accountName = q.AccountName,
                              governorate = q.Governorate,
                              loginDate = q.AddedDate.Value.ToString("dd/MM/yyyy"),
                              phone = q.Phone,
                              userType= q.TypeAccount == 1?"حساب بولى وين" : (q.TypeAccount == 2 ? "وكيل" : (q.TypeAccount == 3 ? "ورشة" : (q.TypeAccount == 4 ? "عميل" : "")))
                          }).OrderByDescending(x => x.id).ToList();
            
            return result;
        }
    }
}
