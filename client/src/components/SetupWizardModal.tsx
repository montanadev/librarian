import {Modal, Button, Select, Input} from "antd";
import {useForm, Controller} from "react-hook-form";
import {Api} from "../utils/Api";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function SetupWizardModal({visible, onClose}: Props) {
    const api = new Api();
    const {register, handleSubmit, control} = useForm();

    return <Modal
        visible={visible}
        onCancel={onClose}
        title="Setup Wizard"
        footer={[
            <Button onClick={onClose}>
                Return
            </Button>,
            <Button type="primary" htmlType="submit" onClick={handleSubmit(api.saveConfig)}>
                Submit
            </Button>
        ]}
    >
        <form>
            <h3>Storage Options</h3>
            <Controller
                name="storageOption"
                defaultValue="nas"
                control={control}
                render={({onChange, value} : any) => (
                    <Select onChange={onChange} value={value} className="w-full">
                        <Select.Option value="nas">NAS</Select.Option>
                        <Select.Option value="local">Local (on the server)</Select.Option>
                    </Select>
                )} />

            <br/><br/>

            <h3>Cloud Vision API Key</h3>
            <Input className="w-full" type="text" {...register("gcvKey")} />

            <br/><br/>

            <h3>Django Secret Key</h3>
            <Controller
                name="djangoSecretKey"
                defaultValue="create"
                control={control}
                render={({onChange, value} : any) => (
                    <Select onChange={onChange} value={value} className="w-full">
                        <Select.Option value="create">Create one for me</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                )} />
        </form>
    </Modal>;
}