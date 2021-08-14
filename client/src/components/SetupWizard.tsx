import {Modal, Button, Select, Input} from "antd";
import {useForm, Controller} from "react-hook-form";
import {Note} from "./Note";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function SetupWizard({visible, onClose}: Props) {
    const {register, handleSubmit, control} = useForm();

    const onSubmit = (data: any) => {
        fetch('http://0.0.0.0:8000/api/config/', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.json())
    };

    return <Modal
        visible={visible}
        onCancel={onClose}
        title="Setup Wizard"
        footer={[]}
    >
        <Note>
            Can also edit these on the Settings page
        </Note>

        <br/>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            
            <br />
            <Button onClick={onClose}>
                Return
            </Button>
            <button type="submit">
                Submit
            </button>

        </form>
    </Modal>;
}