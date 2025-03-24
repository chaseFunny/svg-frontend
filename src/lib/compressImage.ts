"use client";
import { toast } from "sonner";
import { compress } from "squoosh-compress";
export const compressImage: (originalImage: File) => Promise<{ file: File; size: string; base64: string }> = async (
  originalImage
) => {
  if (!originalImage) {
    alert("请先选择一张图片");
    return {
      file: null,
      size: "",
      base64: "",
    };
  }

  try {
    const compressedFile = await compress(
      originalImage,
      {
        type: "browser-webp",
        options: {
          quality: 0.4,
        },
      },
      originalImage.name
    );
    // 将 Blob 转换为 Base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    return {
      base64,
      file: compressedFile,
      size: `${(compressedFile.size / 1024).toFixed(2)} KB`,
    };
  } catch (error) {
    console.error("压缩过程中发生错误：", error);
    toast.error("文件压缩失败，请重试");
  }
  return {
    file: null,
    size: "",
    base64: "",
  };
};
