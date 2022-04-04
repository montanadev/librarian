import NavButtons from "./NavButtons";
import React from "react";
import "../Uploader.css";
import {Button, Divider, Dropdown, Menu, PageHeader, Typography} from "antd";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import {DocumentModel} from "../../models/Document";
import {Tags} from "./Tags";
import {Api} from "../../utils/Api";
import {useQuery, useQueryClient} from "react-query";
import {TagModel} from "../../models/Tag";
import {ResourceModel} from "../../models/Resource";

interface Props {
    document: DocumentModel;
    onDocumentRename: (name: string) => void;
    onAddToFolder: () => void;
    onDeleteDocument: () => void;
    documentId: string;
    folderId: string;
}

export function Toolbar({
                            document,
                            onDocumentRename,
                            onAddToFolder,
                            onDeleteDocument,
                            documentId,
                            folderId,
                        }: Props) {
    const api = new Api();
    const queryClient = useQueryClient();

    const documentTags = useQuery<ResourceModel<TagModel>>("document-tags", () =>
        api.getTagsByDocumentId(documentId)
    );
    const globalTags = useQuery<ResourceModel<TagModel>>("tags", () =>
        api.getTags()
    );

    const refreshTags = () => {
        queryClient.invalidateQueries("document-tags");
        queryClient.invalidateQueries("tags");
    };

    if (!documentTags.data || !globalTags.data) {
        return <>Loading...</>;
    }

    const folderDropdownButtons = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={onAddToFolder}>
                    Add to folder...
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer">
                    Remove from folder...
                </a>
            </Menu.Item>
        </Menu>
    )

    const documentDropdownButtons = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={onDeleteDocument}>
                    Delete document...
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <PageHeader
                title={document.filename}
                onBack={() => window.history.back()}
                extra={[
                    <Dropdown overlay={folderDropdownButtons} placement="bottomCenter">
                        <Button>Folders</Button>
                    </Dropdown>,
                    <Dropdown overlay={documentDropdownButtons} placement="bottomCenter">
                        <Button>Document</Button>
                    </Dropdown>,
                    <NavButtons documentId={documentId} folderId={folderId}/>
                ]}/>

            <Tags
                documentTags={documentTags.data.results}
                globalTags={globalTags.data.results}
                onCreateTag={(newTagName) =>
                    api.createTag(documentId, newTagName).then(refreshTags)
                }
                onDeleteTag={(tagId) =>
                    api.deleteTag(documentId, tagId).then(refreshTags)
                }
                onReplaceTag={(oldTagId, newTagName) =>
                    api.replaceTag(documentId, oldTagId, newTagName).then(refreshTags)
                }
            />

        </>
    );
}
