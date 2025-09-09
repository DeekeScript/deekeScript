declare global {
    var Device: Device;
}

interface Device {
    /**
     * 息屏后，保持 CPU 唤醒，延时释放
     * @param second 保持 CPU 唤醒，延时释放，单位秒
     */
    public keepCpuAwake(second: number): void;

    /**
     * 关闭CPU唤醒状态
     */
    public releaseCpuWakeLock(): void;

    /**
     * 获取屏幕宽度
     */
    public width(): number;

    /**
     * 获取屏幕高度
     */
    public height(): number;

    /**
     * 获取设备版本，如 26
     */
    public sdkInt(): number;

    /**
     * 获取设备
     */
    public device(): string;

    /**
     * 获取设备版本，如 "8.1.0"
     */
    public androidVersion(): string;

    /**
     * 生成设备唯一标识符， 卸载App前，可以通过getUuid获取，卸载后丢失
     */
    public createUuid(): string;

    /**
     * 获取设备唯一标识符
     */
    public getUuid(): string;

    /**
     * 获取设备卡密
     */
    public getToken(): string;

    /**
     * 获取设备其他信息（此方法可以取代getToken和getUuid）
     */
    public getAttr(key: string): string;

    /**
     * 判断屏幕是否亮着
     */
    public isScreenOn(): boolean;

    /**
     * 获取设备品牌， 如 "HUAWEI" 或 "Xiaomi"
     */
    public brand(): string;

    /**
     * 获取设备操作系统名称， 如 "Android"
     */
    public os(): string;

    /**
     * 获取设备型号名称， 如 "Honor V30" 或类似的字符串
     */
    public model(): string;

    /**
     * 获取设备代号， 例如 "REL" 表示正式发布的版本
     */
    public codename(): string;
}

export { };
