import { EditOutlined } from "@ant-design/icons";
import { Input, Typography } from "antd";
import React, { useState } from "react";

interface Props {
  text: string;
  onEdit: (text: string) => void;
}

export function EditableTitle({ text, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  return (
    <>
      {editing ? (
        <Input
          autoFocus
          style={{ fontSize: 24, width: "300px" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            onEdit(inputValue);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              onEdit(inputValue);
              setEditing(false);
            }
          }}
        />
      ) : (
        <Typography.Title level={3}>
          {text}
          <a>
            <EditOutlined
              className={"primary"}
              onClick={() => setEditing(true)}
              style={{ fontSize: 22, verticalAlign: 0 }}
            />
          </a>
        </Typography.Title>
      )}
    </>
  );
}
