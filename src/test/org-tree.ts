interface OrgTreeItem {
  id: string;
  name: string;
  num: number;
  leader: string[];
}
interface OrgTree extends OrgTreeItem {
  children?: Array<OrgTree>;
}

export const orgTreeData: OrgTree = {
  id: "0",
  name: "KBT科技有限公司",
  num: 500,
  leader: ["刘世鹏"],
  children: [
    {
      id: "2",
      name: "产品研发部",
      num: 200,
      leader: ["宇海青"],
      children: [
        {
          id: "5",
          name: "研发-前端",
          num: 20,
          leader: ["徐少艺"],
        },
        {
          id: "6",
          name: "研发-后端",
          num: 50,
          leader: ["徐少艺"],
        },
        {
          id: "9",
          name: "UI设计",
          num: 20,
          leader: ["谢晓彬"],
        },
        {
          id: "10",
          name: "产品经理",
          num: 10,
          leader: ["谢晓彬"],
        },
      ],
    },
    {
      id: "3",
      name: "销售部",
      num: 100,
      leader: ["赵天睿"],
      children: [
        {
          id: "7",
          name: "销售一部",
          num: 50,
          leader: ["Zhang"],
        },
        {
          id: "8",
          name: "销售二部",
          num: 50,
          leader: ["Luo"],
        },
      ],
    },
    {
      id: "4",
      name: "财务部",
      num: 100,
      leader: ["李思佳"],
    },
    {
      id: "9",
      name: "HR人事",
      num: 100,
      leader: ["李海霞"],
    },
  ],
};
