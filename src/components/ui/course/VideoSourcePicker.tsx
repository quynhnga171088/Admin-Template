import { useRef, useState, useCallback } from 'react';
import { resourceApi } from '@/lib/api/resource.api';

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_FORMATS = 'video/mp4,video/quicktime,video/webm,video/x-msvideo';
const ACCEPTED_EXTENSIONS = '.mp4, .mov, .webm, .avi';
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
const MAX_FILE_SIZE_LABEL = '500 MB';

const EXTERNAL_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];

export const detectVideoTab = (url: string): 'upload' | 'url' => {
  if (!url) return 'upload';
  try {
    const hostname = new URL(url).hostname;
    return EXTERNAL_HOSTS.some(h => hostname.includes(h)) ? 'url' : 'upload';
  } catch {
    return 'url';
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface VideoSourcePickerProps {
  courseId: number;
  videoUrl: string;
  onChange: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
const VideoSourcePicker = ({ courseId, videoUrl, onChange, onUploadingChange, disabled }: VideoSourcePickerProps) => {
  const [tab, setTab] = useState<'upload' | 'url'>(() => detectVideoTab(videoUrl));
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string>(() => {
    // If already has a non-external URL, try to extract filename
    if (videoUrl && detectVideoTab(videoUrl) === 'upload') {
      return videoUrl.split('/').pop() ?? '';
    }
    return '';
  });
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Validate file ──────────────────────────────────────────────────────────
  const validateFile = (file: File): string => {
    const allowed = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    if (!allowed.includes(file.type)) {
      return `Định dạng không hợp lệ. Chỉ chấp nhận: ${ACCEPTED_EXTENSIONS}`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE_LABEL}.`;
    }
    return '';
  };

  // ── Handle upload ──────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError('');
    setUploading(true);
    onUploadingChange?.(true);
    setUploadProgress(0);
    setUploadedFileName(file.name);

    try {
      const res = await resourceApi.uploadVideo(file, courseId, (pct) => {
        setUploadProgress(pct);
      });
      onChange(res.data.fileUrl);
    } catch {
      setUploadError('Upload thất bại. Vui lòng thử lại.');
      setUploadedFileName('');
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }, [courseId, onChange, onUploadingChange]);

  // ── File input change ──────────────────────────────────────────────────────
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleUpload(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  };

  // ── Switch tab ─────────────────────────────────────────────────────────────
  const switchTab = (next: 'upload' | 'url') => {
    setTab(next);
    setUploadError('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const isUploadDone = tab === 'upload' && !uploading && uploadedFileName && videoUrl;

  return (
    <div className="vsp-wrapper">
      {/* ── Tab switcher ── */}
      <div className="vsp-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'upload'}
          className={`vsp-tab-btn${tab === 'upload' ? ' vsp-tab-btn--active' : ''}`}
          onClick={() => switchTab('upload')}
          disabled={disabled || uploading}
        >
          <i className="fa-regular fa-upload" /> Upload File
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'url'}
          className={`vsp-tab-btn${tab === 'url' ? ' vsp-tab-btn--active' : ''}`}
          onClick={() => switchTab('url')}
          disabled={disabled || uploading}
        >
          <i className="fa-regular fa-link" /> Nhập URL
        </button>
      </div>

      {/* ── Upload tab ── */}
      {tab === 'upload' && (
        <div className="vsp-upload-area">
          {/* Dropzone (hidden when upload is done) */}
          {!isUploadDone && (
            <div
              className={`vsp-dropzone${dragging ? ' vsp-dropzone--dragging' : ''}${uploading ? ' vsp-dropzone--uploading' : ''}`}
              onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              aria-label="Chọn hoặc kéo thả file video"
            >
              <i className="fa-regular fa-cloud-arrow-up vsp-dropzone-icon" />
              <p className="vsp-dropzone-title">
                {dragging ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
              </p>
              <p className="vsp-dropzone-hint">
                {ACCEPTED_EXTENSIONS} &nbsp;·&nbsp; Tối đa {MAX_FILE_SIZE_LABEL}
              </p>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="vsp-file-input"
            type="file"
            accept={ACCEPTED_FORMATS}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
          />

          {/* Progress bar */}
          {uploading && (
            <div className="vsp-progress-wrapper">
              <div className="vsp-progress-info">
                <i className="fa-regular fa-spinner-third fa-spin" />
                <span className="vsp-progress-filename">{uploadedFileName}</span>
                <span className="vsp-progress-pct">{uploadProgress}%</span>
              </div>
              <div className="vsp-progress">
                <div className="vsp-progress-bar" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Success state */}
          {isUploadDone && (
            <div className="vsp-file-info">
              <i className="fa-regular fa-circle-check vsp-file-info-icon" />
              <div className="vsp-file-info-body">
                <span className="vsp-file-info-name">{uploadedFileName}</span>
                <span className="vsp-file-info-url">{videoUrl}</span>
              </div>
              <button
                type="button"
                className="vsp-file-info-change"
                onClick={() => {
                  onChange('');
                  setUploadedFileName('');
                  setUploadProgress(0);
                }}
                disabled={disabled}
                title="Chọn file khác"
              >
                <i className="fa-regular fa-rotate-right" /> Đổi file
              </button>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="vsp-upload-error">
              <i className="fa-regular fa-circle-exclamation" /> {uploadError}
            </div>
          )}
        </div>
      )}

      {/* ── URL tab ── */}
      {tab === 'url' && (
        <div className="vsp-url-area">
          <input
            id="section-video-url-input"
            type="url"
            className="form-control"
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
          />
          <small className="sp-hint">YouTube, Vimeo, hoặc bất kỳ URL video nào.</small>
        </div>
      )}
    </div>
  );
};

export default VideoSourcePicker;
