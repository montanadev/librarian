import { Spin } from "antd";
import React from "react";

interface Props {
  text?: string;
}

export function Loading({ text = "Loading..." }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "centers",
      }}
    >
      <Spin size="large" tip={text} />
    </div>
  );
}
