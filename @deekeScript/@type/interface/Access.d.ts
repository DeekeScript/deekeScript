global {
    var Access: access;
}

/**
 * 
console.log(Access.isAccessibilityServiceEnabled());
console.log(Access.isFloatWindowsEnabled());
console.log(Access.isBackgroundAlertEnabled());
console.log(Access.isMediaProjectionEnable());

//console.log(Access.backgroundAlertSetting());
//console.log(Access.openAccessibilityServiceSetting());
//console.log(Access.openFloatWindowsSetting());
//console.log(Access.mediaProjectionSetting());


 */
interface access {
    /**
     * 是否开启了无障碍权限
     */
    public isAccessibilityServiceEnabled(): boolean;
    
    /**
     * 是否开启了悬浮窗权限
     */
    public isFloatWindowsEnabled(): boolean;

    /**
     * 是否开启了后台弹窗权限
     */
    public isBackgroundAlertEnabled(): boolean;

    /**
     * 是否开启了截图录屏权限
     */
    public isMediaProjectionEnable(): boolean;

    /**
     * 开启了无障碍权限设置界面
     */
    public openAccessibilityServiceSetting(): void;
    
     /**
     * 开启了悬浮窗权限设置界面
     */
     public openFloatWindowsSetting(): void;

      /**
     * 开启了后台弹窗权限设置界面
     */
    public openBackgroundAlertSetting(): void;

     /**
     * 开启了截图录屏权限设置界面
     */
     public openMediaProjectionSetting(): void;

     /** 
      * 进入通知权限设置界面（用户可以开启通知权限）
      */
     public requestNotificationAccess(): void;

     /**
     * 是否开启读取通知权限
     */
     public hasNotificationAccess(): void;
}

export { };
