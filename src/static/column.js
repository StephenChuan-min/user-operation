//账号管理列表
const accountManagementColumn = [
  {
    prop: "id",
    label: "ID",
    width: "180",
    sort: false,
  },
  {
    prop: "phone",
    label: "账号",
    width: "180",
    sort: false,
  },
  {
    prop: "userName",
    label: "姓名",
    width: "180",
    sort: false,
  },
  {
    prop: "normalErrorNum",
    label: "负责合作机构数",
    width: "180",
    sort: "custom",
  },
  {
    prop: "notIncludeErrorNum",
    label: "债务人数",
    width: "180",
    sort: "custom",
  },
];

//账号管理列表
const taskAssignColumn = [
  {
    prop: "id",
    label: "ID",
    sort: false,
  },
  {
    prop: "phone",
    label: "顶级合作机构",
    sort: false,
  },
  {
    prop: "userName",
    label: "机构类型",
    sort: false,
  },
  {
    prop: "normalErrorNum",
    label: "客户使用机构数",
    sort: "custom",
  },
  {
    prop: "notIncludeErrorNum",
    label: "债务人数",
    sort: "custom",
  },
];

export { accountManagementColumn, taskAssignColumn };
