declare global {
    var Audio: Audio;
}

interface Audio {
    /**
     * 载入音频资源（不会自动播放）
     * @param source 支持 http(s)、file://、content://、绝对路径、project:// 前缀
     * @returns 是否载入成功
     */
    public load(source: string): boolean;

    /**
     * 加载并播放音频
     * @param source 音频资源路径
     * @returns 是否成功
     */
    public play(source: string): boolean;

    /**
     * 播放当前已加载的音频
     * @returns 是否成功
     */
    public play(): boolean;

    /**
     * 暂停播放
     */
    public pause(): boolean;

    /**
     * 停止播放（播放位置重置到开头）
     */
    public stop(): boolean;

    /**
     * 释放播放器资源
     */
    public release(): void;

    /**
     * 跳转到指定位置
     * @param msec 毫秒
     */
    public seekTo(msec: number): boolean;

    /**
     * 设置是否循环播放
     * @param looping 是否循环
     */
    public setLooping(looping: boolean): boolean;

    /**
     * 设置左右声道音量
     * @param leftVolume 左声道音量 0.0 ~ 1.0
     * @param rightVolume 右声道音量 0.0 ~ 1.0
     */
    public setVolume(leftVolume: number, rightVolume: number): boolean;

    /**
     * 是否正在播放
     */
    public isPlaying(): boolean;

    /**
     * 是否已加载音频
     */
    public isLoaded(): boolean;

    /**
     * 获取音频总时长（毫秒），未加载返回 -1
     */
    public getDuration(): number;

    /**
     * 获取当前播放位置（毫秒），未加载返回 -1
     */
    public getCurrentPosition(): number;

    /**
     * 获取当前加载的音频源路径
     */
    public getCurrentSource(): string;

    /**
     * 是否具备后台播放能力（检测前台服务权限）
     */
    public canPlayInBackground(): boolean;

    /**
     * 是否已声明前台服务权限（Android 9+ 推荐用于后台保活播放）
     */
    public hasForegroundServicePermission(): boolean;
}

export { };
