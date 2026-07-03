import { modalStore } from '@/stores/modal.store.ts';

const FormControlsDemoPage = () => {
  const setEnableCancelButton = modalStore(state => state.setEnableCancelButton);
  const setEnableOkButton = modalStore(state => state.setEnableOkButton);
  const setCallback = modalStore(state => state.setCallback);
  const setMessage = modalStore(state => state.setMessage);
  const setTitle = modalStore(state => state.setTitle);
  const setOpen = modalStore(state => state.setOpen);
  const setProcessing = modalStore(state => state.setProcessing);

  const confirmAction = () => {
    setMessage('Bạn đã xác nhận hành động!');
    setEnableCancelButton(false);
    setEnableOkButton(true);
    setTitle('Xác nhận');
    setCallback(null);
    setOpen(true);
  };

  const simulateProcessing = () => {
    setProcessing(true, 'Đang xử lý, vui lòng chờ...');
    setTimeout(() => setProcessing(false), 3000);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Input Text</div>
          </div>
          <div className="card-body flex flex-col gap-4">
            {/* Mặc định */}
            <div>
              <label className="form-label" htmlFor="demo-text-default">
                Default
              </label>
              <input
                id="demo-text-default"
                type="text"
                className="form-control"
                placeholder="Nhập nội dung..."
              />
            </div>

            {/* Small */}
            <div>
              <label className="form-label" htmlFor="demo-text-sm">
                Small
              </label>
              <input
                id="demo-text-sm"
                type="text"
                className="form-control form-control-sm"
                placeholder="Small input..."
              />
            </div>

            {/* Large */}
            <div>
              <label className="form-label" htmlFor="demo-text-lg">
                Large
              </label>
              <input
                id="demo-text-lg"
                type="text"
                className="form-control form-control-lg"
                placeholder="Large input..."
              />
            </div>

            {/* Error state */}
            <div>
              <label className="form-label" htmlFor="demo-text-error">
                Error State
              </label>
              <input
                id="demo-text-error"
                type="text"
                className="form-control error"
                placeholder="Input lỗi..."
                defaultValue="Giá trị sai"
              />
              <span className="error-message text-sm">Trường này là bắt buộc.</span>
            </div>

            {/* Disabled */}
            <div>
              <label className="form-label" htmlFor="demo-text-disabled">
                Disabled
              </label>
              <input
                id="demo-text-disabled"
                type="text"
                className="form-control"
                placeholder="Không thể nhập..."
                disabled
              />
            </div>

            {/* Plaintext (read-only, không có border) */}
            <div>
              <label className="form-label" htmlFor="demo-text-plain">
                Plaintext (Read-only)
              </label>
              <input
                id="demo-text-plain"
                type="text"
                className="form-control-plaintext"
                defaultValue="Giá trị chỉ đọc"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Select / Dropdown</div>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div>
              <label className="form-label" htmlFor="demo-select">
                Default Select
              </label>
              <select id="demo-select" className="form-select">
                <option value="">-- Chọn một tùy chọn --</option>
                <option value="1">Tùy chọn 1</option>
                <option value="2">Tùy chọn 2</option>
                <option value="3">Tùy chọn 3</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="demo-select-sm">
                Select – Small
              </label>
              <select id="demo-select-sm" className="form-select form-select-sm">
                <option value="1">Nhỏ hơn</option>
                <option value="2">Tùy chọn 2</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="demo-select-lg">
                Select – Large
              </label>
              <select id="demo-select-lg" className="form-select form-select-lg">
                <option value="1">Lớn hơn</option>
                <option value="2">Tùy chọn 2</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="demo-select-error">
                Select – Error
              </label>
              <select id="demo-select-error" className="form-select error">
                <option value="">-- Bắt buộc chọn --</option>
                <option value="1">Tùy chọn 1</option>
              </select>
              <span className="error-message text-sm">Vui lòng chọn một tùy chọn.</span>
            </div>

            <div>
              <label className="form-label" htmlFor="demo-select-multiple">
                Select Multiple
              </label>
              <select id="demo-select-multiple" className="form-select" multiple size={4}>
                <option value="1">Mục 1</option>
                <option value="2">Mục 2</option>
                <option value="3">Mục 3</option>
                <option value="4">Mục 4</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">File Input & Color</div>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div>
              <label className="form-label" htmlFor="demo-file">
                File Upload
              </label>
              <input id="demo-file" type="file" className="form-control" />
            </div>
            <div>
              <label className="form-label" htmlFor="demo-file-sm">
                File Upload – Small
              </label>
              <input id="demo-file-sm" type="file" className="form-control form-control-sm" />
            </div>
            <div>
              <label className="form-label" htmlFor="demo-color">
                Color Picker
              </label>
              <input
                id="demo-color"
                type="color"
                className="form-control form-control-color"
                defaultValue="#04a9f5"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Checkbox</div>
          </div>
          <div className="card-body flex flex-col gap-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chk-default" />
              <label className="form-check-label" htmlFor="chk-default">
                Checkbox mặc định (chưa chọn)
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chk-checked" defaultChecked />
              <label className="form-check-label" htmlFor="chk-checked">
                Checkbox đã được chọn (checked)
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input error" type="checkbox" id="chk-error" />
              <label className="form-check-label" htmlFor="chk-error">
                Checkbox lỗi (error)
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chk-disabled" disabled />
              <label className="form-check-label" htmlFor="chk-disabled">
                Checkbox bị vô hiệu hóa (disabled)
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Toggle Switch</div>
          </div>
          <div className="card-body flex flex-col gap-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="switch-default" />
              <label className="form-check-label" htmlFor="switch-default">
                Switch mặc định (tắt)
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="switch-on" defaultChecked />
              <label className="form-check-label" htmlFor="switch-on">
                Switch đang bật (on)
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="switch-disabled" disabled />
              <label className="form-check-label" htmlFor="switch-disabled">
                Switch bị vô hiệu hóa
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Range Slider</div>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div>
              <label className="form-label" htmlFor="demo-range">
                Range mặc định
              </label>
              <input
                id="demo-range"
                type="range"
                className="form-range"
                min="0"
                max="100"
                defaultValue="50"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="demo-range-disabled">
                Range – Disabled
              </label>
              <input
                id="demo-range-disabled"
                type="range"
                className="form-range"
                disabled
                defaultValue="30"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-header-title">Input Group (Kết hợp input với text/button)</div>
          </div>
          <div className="card-body grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Text trước */}
            <div>
              <label className="form-label">Prefix Text</label>
              <div className="input-group">
                <span className="input-group-text bg-secondary-300/10">@</span>
                <input type="text" className="form-control" placeholder="username" />
              </div>
            </div>

            {/* Text sau */}
            <div>
              <label className="form-label">Suffix Text</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Số tiền" />
                <span className="input-group-text bg-secondary-300/10">VNĐ</span>
              </div>
            </div>

            {/* Button sau */}
            <div>
              <label className="form-label">Input + Button</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Tìm kiếm..." />
                <button className="btn btn-primary" type="button">
                  Tìm
                </button>
              </div>
            </div>

            {/* Cả hai */}
            <div>
              <label className="form-label">Prefix + Suffix</label>
              <div className="input-group">
                <span className="input-group-text bg-secondary-300/10">$</span>
                <input type="number" className="form-control" placeholder="0.00" />
                <span className="input-group-text bg-secondary-300/10">.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Textarea</div>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div>
              <label className="form-label" htmlFor="demo-textarea">
                Default Textarea
              </label>
              <textarea
                id="demo-textarea"
                className="form-control"
                rows={4}
                placeholder="Nhập nội dung dài..."
              />
            </div>

            <div>
              <label className="form-label" htmlFor="demo-textarea-error">
                Textarea – Error
              </label>
              <textarea
                id="demo-textarea-error"
                className="form-control error"
                rows={3}
                defaultValue="Nội dung không hợp lệ"
              />
              <span className="error-message text-sm">Vui lòng kiểm tra lại nội dung.</span>
            </div>

            <div>
              <label className="form-label" htmlFor="demo-textarea-disabled">
                Textarea – Disabled
              </label>
              <textarea
                id="demo-textarea-disabled"
                className="form-control"
                rows={3}
                disabled
                placeholder="Không thể chỉnh sửa..."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">Buttons</div>
          </div>
          <div className="card-body flex flex-col gap-6">
            {/* Solid */}
            <div>
              <p className="form-label mb-2">Solid</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary" type="button" onClick={() => {
                  setCallback(confirmAction);
                  setTitle('Modal Title');
                  setMessage('Bạn đã mở modal thành công!');
                  setOpen(true);
                }}>
                  Open Modal
                </button>
                <button className="btn btn-info" type="button" onClick={() => simulateProcessing()}>
                  Processing (3s)
                </button>
                <button className="btn btn-primary" type="button">
                  Primary
                </button>
                <button className="btn btn-secondary" type="button">
                  Secondary
                </button>
                <button className="btn btn-success" type="button">
                  Success
                </button>
                <button className="btn btn-danger" type="button">
                  Danger
                </button>
                <button className="btn btn-warning" type="button">
                  Warning
                </button>
                <button className="btn btn-info" type="button">
                  Info
                </button>
                <button className="btn btn-dark" type="button">
                  Dark
                </button>
                <button className="btn btn-light" type="button">
                  Light
                </button>
                <button className="btn btn-link" type="button">
                  Link
                </button>
              </div>
            </div>

            {/* Outline */}
            <div>
              <p className="form-label mb-2">Outline</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-outline-primary" type="button">
                  Primary
                </button>
                <button className="btn btn-outline-secondary" type="button">
                  Secondary
                </button>
                <button className="btn btn-outline-success" type="button">
                  Success
                </button>
                <button className="btn btn-outline-danger" type="button">
                  Danger
                </button>
                <button className="btn btn-outline-warning" type="button">
                  Warning
                </button>
                <button className="btn btn-outline-info" type="button">
                  Info
                </button>
                <button className="btn btn-outline-dark" type="button">
                  Dark
                </button>
              </div>
            </div>

            {/* Light */}
            <div>
              <p className="form-label mb-2">Light</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-light-primary" type="button">
                  Primary
                </button>
                <button className="btn btn-light-secondary" type="button">
                  Secondary
                </button>
                <button className="btn btn-light-success" type="button">
                  Success
                </button>
                <button className="btn btn-light-danger" type="button">
                  Danger
                </button>
                <button className="btn btn-light-warning" type="button">
                  Warning
                </button>
                <button className="btn btn-light-info" type="button">
                  Info
                </button>
                <button className="btn btn-light-dark" type="button">
                  Dark
                </button>
              </div>
            </div>

            {/* Link Variant */}
            <div>
              <p className="form-label mb-2">Link Variant</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-link-primary" type="button">
                  Primary
                </button>
                <button className="btn btn-link-secondary" type="button">
                  Secondary
                </button>
                <button className="btn btn-link-success" type="button">
                  Success
                </button>
                <button className="btn btn-link-danger" type="button">
                  Danger
                </button>
                <button className="btn btn-link-warning" type="button">
                  Warning
                </button>
                <button className="btn btn-link-info" type="button">
                  Info
                </button>
                <button className="btn btn-link-dark" type="button">
                  Dark
                </button>
              </div>
            </div>

            {/* Sizes & States */}
            <div>
              <p className="form-label mb-2">Sizes &amp; States</p>
              <div className="flex flex-wrap items-center gap-2">
                <button className="btn btn-primary btn-sm" type="button">
                  Small
                </button>
                <button className="btn btn-primary" type="button">
                  Default
                </button>
                <button className="btn btn-primary btn-lg" type="button">
                  Large
                </button>
                <button className="btn btn-secondary disabled" type="button" aria-disabled="true">
                  Disabled
                </button>
                <button className="btn btn-outline-danger" type="button" disabled>
                  Disabled (attr)
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <p className="form-label mb-2">Icon Buttons</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-primary btn-icon"
                  type="button"
                  title="Thêm mới"
                >
                  <i className="fa-solid fa-plus" aria-hidden="true" />
                </button>
                <button
                  className="btn btn-outline-secondary btn-icon"
                  type="button"
                  title="Chỉnh sửa"
                >
                  <i className="fa-solid fa-pen" aria-hidden="true" />
                </button>
                <button className="btn btn-light-danger btn-icon" type="button" title="Xóa">
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </button>
                <button className="btn btn-light-info btn-icon" type="button" title="Tải xuống">
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </button>
                <button className="btn btn-outline-dark btn-icon avtar-s" type="button" title="Nhỏ">
                  <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true" />
                </button>
                <button className="btn btn-primary btn-icon avtar-l" type="button" title="Lớn">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormControlsDemoPage;
export { FormControlsDemoPage as Component };
