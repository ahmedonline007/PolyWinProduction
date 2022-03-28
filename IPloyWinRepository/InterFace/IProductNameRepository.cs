﻿using PloyWinContext.Entities;
using PloyWinDto.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IPloyWinRepository.InterFace
{
    public interface IProductNameRepository : IGenericRepository<TblProductName>
    {
        Response<List<DtoProductName>> GetAllProductName();
        Response<List<DtoProductNameWithCatAndCode>> GetAllProductNameCodeCat();
        Response<DtoProductName> AddEditProductName(DtoProductName dto);
        Response<bool> DeleteProductName(string Ids);
    }
}
