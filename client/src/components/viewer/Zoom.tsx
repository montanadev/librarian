import { Slider } from "antd";
import React from "react";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

interface Props {
  onSetZoom: (zoom: number) => void;
  defaultZoom: number;
}

export function Zoom({ onSetZoom, defaultZoom }: Props) {
  return (
    <>
      <div className="icon-wrapper">
        <ZoomOutOutlined />
        <Slider
          style={{ width: 50 }}
          min={0.1}
          max={4}
          step={0.1}
          defaultValue={defaultZoom}
          onChange={onSetZoom}
        />
        <ZoomInOutlined />
      </div>
    </>
  );
}
