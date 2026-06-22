import { useState } from 'react';
import { useSettingsQuery, useUpdateSettingMutation } from '@/lib/queries/settings.queries';
import type { ISetting } from '@/types/types';
import '@/pages/settings/SettingsPage.scss';

interface SettingItemProps {
  setting: ISetting;
  saving: boolean;
  onSave: (key: string, value: string) => void;
}

const SettingItem = ({ setting, saving, onSave }: SettingItemProps) => {
  const [localValue, setLocalValue] = useState(setting.value);

  return <div className="settings-item">
    <span className="settings-key-badge">{setting.key}</span>
    <p className="settings-description">{setting.description}</p>
    <div className="input-group">
      <input type="text" className="form-control" value={localValue} onChange={e => setLocalValue(e.target.value)} />
      <button className="btn btn-primary" type="button" onClick={() => onSave(setting.key, localValue)} disabled={saving || localValue === setting.value}>
        {saving ?
          <span><i className="fa-regular fa-spinner-third fa-spin" /> Saving</span>
          : <span><i className="fa-regular fa-floppy-disk" /> Save</span>}
      </button>
    </div>
  </div>;
};

const SettingsPage = () => {
  const { data: settings = [], isLoading } = useSettingsQuery();
  const { mutate: updateSetting } = useUpdateSettingMutation();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const handleSave = (key: string, value: string) => {
    setSavingKey(key);
    updateSetting({ key, data: { value } }, { onSettled: () => setSavingKey(null) });
  };

  return (
    <div className="settings-page">
      <div className="card">
        <div className="card-header">
          <div className="card-header-title">
            <i className="fa-regular fa-gear" /> System Configuration
          </div>
        </div>

        <div className="card-body">
          {isLoading && (
            <div className="settings-loading">
              <i className="fa-regular fa-spinner-third fa-spin" /> Đang tải...
            </div>
          )}

          {!isLoading && settings.length === 0 && <div className="settings-empty">Không có cấu hình nào.</div>}

          {settings.map((setting: ISetting) => (
            <SettingItem key={setting.key} setting={setting} saving={savingKey === setting.key} onSave={handleSave} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
export { SettingsPage as Component };
