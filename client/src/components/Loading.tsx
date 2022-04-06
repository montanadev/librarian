import { Spin } from "antd";
import React from "react";

export function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "centers",
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
}
