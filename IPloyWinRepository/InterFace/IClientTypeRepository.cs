﻿using PloyWinContext.Entities;
using PloyWinDto.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IPloyWinRepository.InterFace
{
    public interface IClientTypeRepository : IGenericRepository<TblClientType>
    {
        Response<List<DtoClientType>> GetAllClientType();
       
    }
}
