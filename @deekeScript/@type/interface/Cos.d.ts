declare global {
    var Cos: Cos;
}

interface CosCallback {
    success: (url: string) => void;
    fail: (error: string) => void;
}

interface Cos {
    /**
     * 设置腾讯云COS配置，调用此方法后会自动初始化COSClient
     * @param secretId 腾讯云SecretId
     * @param secretKey 腾讯云SecretKey
     * @param region 地域，例如 "ap-guangzhou"
     * @param bucket 存储桶名称，例如 "my-bucket-1234567890"
     */
    setConfig(secretId: string, secretKey: string, region: string, bucket: string): void;

    /**
     * 同步上传文件到COS（指定cosKey）
     * @param localPath 本地文件路径
     * @param cosKey COS上的对象键（路径），例如 "images/photo.jpg"
     * @returns 返回数组 [url, error]，上传成功时 url 为文件地址且 error 为 null，失败时 url 为 null 且 error 为错误信息
     */
    upload(localPath: string, cosKey: string): [string | null, string | null];

    /**
     * 同步上传文件到COS（自动生成cosKey，格式为 uploads/时间戳_文件名）
     * @param localPath 本地文件路径
     * @returns 返回数组 [url, error]，上传成功时 url 为文件地址且 error 为 null，失败时 url 为 null 且 error 为错误信息
     */
    upload(localPath: string): [string | null, string | null];

    /**
     * 异步上传文件到COS（指定cosKey）
     * @param localPath 本地文件路径
     * @param cosKey COS上的对象键（路径）
     * @param callback 回调对象 { success: (url) => {}, fail: (error) => {} }
     */
    uploadAsync(localPath: string, cosKey: string, callback: CosCallback): void;

    /**
     * 异步上传文件到COS（自动生成cosKey）
     * @param localPath 本地文件路径
     * @param callback 回调对象 { success: (url) => {}, fail: (error) => {} }
     */
    uploadAsync(localPath: string, callback: CosCallback): void;

    /**
     * 关闭COSClient，释放资源
     */
    shutdown(): void;
}

export { };
