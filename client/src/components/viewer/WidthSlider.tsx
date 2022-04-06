import { Slider } from "antd";
import React from "react";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

interface Props {
  onSetWidth: (width: number) => void;
  defaultWidth: number;
}

export function WidthSlider({ onSetWidth, defaultWidth }: Props) {
  return (
    <div className="icon-wrapper">
      <ZoomOutOutlined />
      <Slider
        style={{ width: 50 }}
        min={0.1}
        max={1}
        step={0.1}
        defaultValue={defaultWidth}
        onChange={onSetWidth}
      />
      <ZoomInOutlined />
    </div>
  );
}
