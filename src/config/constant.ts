export const tableStatusFilter = (status: string): "success" | "info" | "danger" => {
  const statusMap: { [key: string]: "success" | "info" | "danger" } = {
    Enable: "success",
    Disable: "info",
    Deleted: "danger",
  };
  return statusMap[status];
};
