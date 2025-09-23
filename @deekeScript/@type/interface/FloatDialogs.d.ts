declare global {
    var FloatDialogs: FloatDialogs;
}

interface FloatDialogs {
    /**
     * 悬浮窗弹窗（需要开启悬浮窗权限）
     * @param title 弹窗标题
     * @param content 弹窗内容
     */
    public show(title: string, content: string): void;

    /**
     * 悬浮窗弹窗（需要开启悬浮窗权限）
     * @param content 弹窗内容
     */
    public show(content: string): void;

    /**
     * 关闭FloatDialogs开启的所有弹窗
     */
    public closeAll(): boolean;
}

export { };
