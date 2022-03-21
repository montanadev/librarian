import { AutoComplete, Input, Tag, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { TagModel } from "../../models/Tag";

interface Props {
  documentTags: TagModel[];
  globalTags: TagModel[];
  onReplaceTag: (oldTagId: number, newTagName: string) => void;
  onCreateTag: (newTagName: string) => void;
  onDeleteTag: (tagId: number) => void;
}

export function Tags({
  documentTags,
  globalTags,
  onReplaceTag,
  onCreateTag,
  onDeleteTag,
}: Props) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [editInputValue, setEditInputValue] = useState<string>("");
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [filteredGlobalTags, setFilteredGlobalTags] =
    useState<TagModel[]>(globalTags);

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible && input.current) {
      input.current.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    if (editInputIndex > -1 && editInput.current) {
      editInput.current.focus();
    }
  }, [editInputIndex]);

  const handleInputChange = (e: any) => {
    setInputValue(e);
    console.log("on change", e);
  };

  const handleInputConfirm = (tag: string) => {
    onCreateTag(tag);
    console.log("on confirm", tag);

    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    onReplaceTag(documentTags[editInputIndex].id, editInputValue);

    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const input = useRef<any>();
  const saveInputRef = (i: any) => {
    input.current = i;
  };

  const editInput = useRef<any>();
  const saveEditInputRef = (i: any) => {
    editInput.current = i;
  };

  const onSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredGlobalTags(globalTags);
      return;
    }

    let matches = [];
    let foundTag = false;
    for (let tag of filteredGlobalTags) {
      if (tag.name.indexOf(searchText) > -1) {
        if (tag.name === searchText) {
          foundTag = true;
        }
        matches.push(tag);
      }
    }
    if (!foundTag) {
      // If there's not a precise match, push the current search as a fake tag
      // that can be used to create a new tag.
      // Can't push both a precise match and fake new tag (key collision)
      matches.push({
        id: -1,
        name: searchText,
        documents: [],
      } as TagModel);
    }
    setFilteredGlobalTags(matches);
  };

  return (
    <>
      {documentTags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={saveEditInputRef}
              key={tag.id}
              size="small"
              style={{ width: 250, marginRight: 8, verticalAlign: "top" }}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.name.length > 20;
        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag.name}
            closable={true}
            onClose={() => onDeleteTag(tag.id)}
          >
            <span
              onDoubleClick={(e) => {
                setEditInputIndex(index);
                setEditInputValue(tag.name);
                e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag.name} key={tag.id}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        // <Input
        //   ref={saveInputRef}
        //   type="text"
        //   size="small"
        //   style={{ width: 250, marginRight: 8, verticalAlign: "top" }}
        //   value={inputValue}
        //   onChange={handleInputChange}
        //   onBlur={handleInputConfirm}
        //   onPressEnter={handleInputConfirm}
        // />
        <AutoComplete
          ref={saveInputRef}
          value={inputValue}
          options={filteredGlobalTags.map((t) => {
            return { value: t.name, id: t.id };
          })}
          style={{ width: 200 }}
          onSelect={handleInputConfirm}
          onSearch={onSearch}
          onChange={handleInputChange}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter" && inputValue) {
          //     handleInputConfirm(inputValue);
          //   }
          // }}
          placeholder="control mode"
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
}
