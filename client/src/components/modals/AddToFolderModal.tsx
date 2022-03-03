import {Button, Cascader, Modal} from "antd";
import {Api} from "../../utils/Api";
import {ResourceModel} from "../../models/Resource";
import {FolderModel} from "../../models/Folder";
import {useEffect, useState} from "react";

interface Props {
    visible: boolean;
    onClose: () => void;
    onAddToFolder: (folderId: number) => void;
}

export function AddToFolderModal({visible, onClose, onAddToFolder}: Props) {
    const [folderId, setFolderId] = useState<any>()
    const [folders, setFolders] = useState<ResourceModel<FolderModel>>();

    useEffect(() => {
        (async () => {
            const api = new Api()
            const folders = await api.getFolders()
            setFolders(folders);
        })()
    }, [])


    const options = folders ? folders.results.map((f: FolderModel) => {
        return {value: f.id, "label": f.name}
    }): []
    const filter = (inputValue: string, path: any) => {
        return path.some((option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    return <Modal
        visible={visible}
        onCancel={onClose}
        title="Add Document to Folder"
        footer={[
            <Button onClick={onClose}>
                Return
            </Button>,
            <Button type="primary" htmlType="submit" onClick={() => onAddToFolder(folderId)}>
                Submit
            </Button>
        ]}
    >
        <form>
            <h3>Folder name {folderId}</h3>
            <Cascader options={options} showSearch={{filter}} onChange={(value, selectedOptions) => setFolderId(value)}/>
        </form>
    </Modal>
}