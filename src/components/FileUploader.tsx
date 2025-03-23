"use client";
import { Button } from "@/components/ui/button";
import { cn, compressImage, fileToBase64 } from "@/lib/utils";
import { FileIcon, ImageIcon, XCircleIcon } from "lucide-react";
import Upload from "rc-upload";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  fileType: "image" | "file";
  file: File;
  base64: string;
}

interface FileUploaderProps {
  onFileUploaded: (file: UploadedFile) => void;
  className?: string;
}

export function FileUploader({ onFileUploaded, className }: FileUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [documentFile, setDocumentFile] = useState<UploadedFile | null>(null);

  // 检查是否已经上传了一个图片和一个文件
  const isUploadDisabled = !!imageFile && !!documentFile;

  // 文件校验
  const validateFile = (file: File): boolean => {
    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`文件大小不能超过 2MB，当前文件大小：${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    // 检查文件类型和已上传状态
    const isImage = IMAGE_TYPES.includes(file.type);

    if (isImage && imageFile) {
      toast.error("已上传图片，请先移除现有图片");
      return false;
    }

    if (!isImage && documentFile) {
      toast.error("已上传文件，请先移除现有文件");
      return false;
    }

    return true;
  };

  // 处理文件上传
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    try {
      const isImage = IMAGE_TYPES.includes(file.type);
      let base64: string;
      let uploadedFile: File;
      if (isImage) {
        const { base64: compressedBase64, file: compressedFile } = await compressImage(file);
        base64 = compressedBase64;
        uploadedFile = compressedFile;
      } else {
        base64 = await fileToBase64(file);
        uploadedFile = file;
      }

      const fileObject = {
        name: file.name,
        type: file.type,
        fileType: (isImage ? "image" : "file") as "image" | "file",
        size: file.size,
        base64,
        file: uploadedFile,
      };

      // 更新内部状态
      if (isImage) {
        setImageFile(fileObject);
      } else {
        setDocumentFile(fileObject);
      }

      // 调用外部回调
      onFileUploaded(fileObject);

      toast.success(`${isImage ? "图片" : "文件"}上传成功`);
    } catch (error) {
      console.error("文件处理失败：", error);
      toast.error("文件处理失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  // 移除文件
  const handleRemoveFile = (type: "image" | "document") => {
    if (type === "image") {
      setImageFile(null);
    } else {
      setDocumentFile(null);
    }
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {/* 图片文件显示 */}
      {imageFile && (
        <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-md">
          <ImageIcon size={16} />
          <span className="text-xs truncate max-w-24">{imageFile.name}</span>
          <button
            onClick={() => handleRemoveFile("image")}
            className="text-muted-foreground hover:text-destructive"
            aria-label="移除图片"
          >
            <XCircleIcon size={16} />
          </button>
        </div>
      )}

      {/* 普通文件显示 */}
      {documentFile && (
        <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-md">
          <FileIcon size={16} />
          <span className="text-xs truncate max-w-24">{documentFile.name}</span>
          <button
            onClick={() => handleRemoveFile("document")}
            className="text-muted-foreground hover:text-destructive"
            aria-label="移除文件"
          >
            <XCircleIcon size={16} />
          </button>
        </div>
      )}

      {/* 上传按钮 */}
      <Upload
        title="上传图片或文件"
        accept="*/*"
        beforeUpload={handleUpload}
        customRequest={({ onSuccess }) => onSuccess?.("ok")}
        disabled={isProcessing || isUploadDisabled}
      >
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          disabled={isProcessing || isUploadDisabled}
        >
          {isProcessing ? (
            <div className="h-4 w-4 border-2 border-muted-foreground/50 border-t-foreground rounded-full animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )}
        </Button>
      </Upload>
    </div>
  );
}
