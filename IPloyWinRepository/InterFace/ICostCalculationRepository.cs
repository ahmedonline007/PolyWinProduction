﻿using PloyWinContext.Entities;
using PloyWinDto.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IPloyWinRepository.InterFace
{
    public interface ICostCalculationRepository : IGenericRepository<TblCostCalculation>
    {
        int AddCostCalc(CostCalc dto);
        bool UpdateCostCalcToClient(int? CostCalcId, int? ClientId);
        List<CostCalc> GetCostCalcByClientId(int Client);
        bool DeleteCostCalc(int Id);
    }
}
