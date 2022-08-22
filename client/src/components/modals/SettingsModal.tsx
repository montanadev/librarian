import { Input } from "antd";
import { Api } from "../../utils/Api";
import { useQuery } from "react-query";
import { SettingsModel } from "../../models/Settings";
import { SettingsInternalModal } from "./SettingsInternalModal";

const { TextArea } = Input;

interface Props {
  visible: boolean;
  onClose: () => void;
}


export function SettingsModal({ visible, onClose }: Props) {
  const api = new Api();

  const settings = useQuery<SettingsModel>("settings", api.getSettings);

  if (settings.isLoading || !settings.data) {
    return null;
  }

  return <SettingsInternalModal visible={visible} onClose={onClose} data={settings.data} />;
}

