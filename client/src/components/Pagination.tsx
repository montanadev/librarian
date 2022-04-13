import { ResourceModel } from "../models/Resource";
import { Pagination as AntdPagination } from "antd";

interface Props {
  data: ResourceModel<any>;
  limit: number;
  offset: number;
  onChange: (offset: number) => void;
}

export function Pagination({ data, onChange, offset, limit }: Props) {
  if (data.count < 10) {
    return null;
  }
  const page = Math.floor(offset / limit) + 1;

  return (
    <AntdPagination
      defaultCurrent={page}
      total={data.count}
      pageSize={limit}
      showSizeChanger={false}
      onChange={(page: number, pageSize: number) => {
        onChange((page - 1) * pageSize);
      }}
    />
  );
}
