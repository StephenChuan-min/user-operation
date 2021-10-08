const rule = {
  orgName: [
    { required: true, message: '请输入合作机构名称', trigger: 'blur' },
  ],
  startDate: [
    {
      required: true,
      message: '请选择开始日期',
      trigger: 'change',
      type: 'date',
    },
  ],
  endDate: [
    {
      required: true,
      message: '请选择结束日期',
      trigger: 'change',
      type: 'date',
    },
  ],
  isLimitedSearchNums: [
    {
      required: true,
    },
  ],
  limitedSearchNums: [{
    required: true, message: '请输入上限', trigger: 'blur',
  }],
  isLimitedDebtorNums: [
    {
      required: true,
    },
  ],
  limitedDebtorNums: [
    {
      required: true, message: '请输入上限', trigger: 'blur',
    },
  ],
};
export default rule;
