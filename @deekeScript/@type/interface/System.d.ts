declare global {
    var System: System;
}

interface System {
    /**
     * 休眠
     * @param milliSecond 毫秒
     */
    public sleep(milliSecond: number): void;

    /**
     * 释放内存
     */
    public gc(): void;

    /**
     * 获取当前时间  yyyy-MM-dd HH:mm:ss.SSS 格式
     */
    public time(): string;

    /**
     * 获取当前Activity
     */
    public currentActivity(): string;

    /**
     * 获取当前包名
     */
    public currentPackage(): string;

    /**
     * 将内容设置到剪切板中
     * @param text 剪切板内容
     */
    public setClip(text: string): void;

    /**
     * 获取剪切板内容
     */
    public getClip(): string;

    /**
     * 吐司
     * @param text 显示文本
     */
    public toast(text: string): void;

    /**
     * 吐司（显示时间较长）
     * @param text 显示文本
     */
    public toastLong(text: string): void;

    /**
     * 
     * @param activity 等待的Activity
     * @param period 每次时间间隔
     * @param timeout 等待的总时间
     */
    public waitForActivity(activity: string, period: number, timeout: number): boolean;

    /**
     * 
     * @param activity 等待的PackageName的App启动
     * @param period 每次时间间隔
     * @param timeout 等待的总时间
     */
    public waitForPackage(packageName: string, period: number, timeout: number): boolean;

    /**
     * 停止所有脚本
     */
    public exit(): void;

    /**
     * 缓存清理
     */
    public cleanUp(): void;

    /**
     * 获取智能话术token
     * @param key 智能话术key
     * @param secret 智能话术secret
     */
    public AiSpeechToken(key: string, secret: string): string;

    /**
     * 生成窗口元素，使用App的上传日志，可以拿到文件
     */
    public generateWindowElements(): void;

    /**
     * 获取接口返回的内容
     * @param key 
     * @param dataForm 
     * @param content 
     */
    public getDataFrom(key: string, dataForm: string, content: string): string | null;

    /**
     * 是否显示时间悬浮窗窗口
     * @param show 是否显示
     */
    public setTimeWindowShow(show: boolean);
}

export { };
