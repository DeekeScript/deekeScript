let Common = require('../core/wx/Common.js');
let Index = require('../core/wx/Index.js');

let task = {
    nickname: '',
    wechatNo: '',
    hour: 24,//默认超过24小时不采集，测试改成5天
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log-wechat-" + file + ".txt";
        Log.setFile(allFile);
    },

    cosCheck() {
        if (!Storage.get('cos_secret_id') || !Storage.get('cos_secret_key') || !Storage.get('cos_region') || !Storage.get('cos_bucket')) {
            FloatDialogs.show("提示", '请配置COS信息');
            System.exit();
            System.sleep(5000);
            return;
        }
    },

    apiCheck() {
        if (!Storage.get('upload_api') || !Storage.get('check_api') || !Storage.get('upload_app_key') || !Storage.get('upload_app_secret')) {
            FloatDialogs.show("提示", '请配置COS信息');
            System.exit();
            System.sleep(5000);
            return;
        }
    },

    checkWechat(wechat) {
        let timestamp = Date.now().toString();
        let appKey = Storage.get('upload_app_key');
        let appSecret = Storage.get('upload_app_secret');
        let api = Storage.get('check_api');
        let body = {
            wechatNo: wechat,
        }

        let nonce = Math.floor(Math.random() * 1000000000) + '';
        let bodyHash = Encrypt.sha256(JSON.stringify(body));
        let stringToSign = `appKey=${appKey}&bodyHash=${bodyHash}&nonce=${nonce}&timestamp=${timestamp}`;
        let sign = Encrypt.hmac_sha256(appSecret, stringToSign);
        Common.log('stringToSign:' + stringToSign);
        Common.log('请求参数：', api, body, { 'X-App-Key': appKey, 'X-Timestamp': timestamp, 'X-Nonce': nonce, 'X-Sign': sign });
        let res = Http.post(api, body, {
            'X-App-Key': appKey,
            'X-Timestamp': timestamp,
            'X-Nonce': nonce,
            'X-Sign': sign,
            'Content-Type': 'application/json'
        });

        Common.log('请求返回结果：', res);

        let result = JSON.parse(res);
        if (result.code != 0) {
            FloatDialogs.toastLong('微信会员判断接口异常：' + result.msg);
            return false;
        }

        return result.data;
    },

    /**
     * 
     * @param {string} wechat 
     * @param {string} title 
     * @param {Array<string>} imagesUrl 
     * @param {string} videoUrl 
     * @param {string} publishTime 
     */
    uploadData(wechat, title, imagesUrl, videoUrl, publishTime) {
        //appKey={appKey}&bodyHash={bodyHash}&nonce={nonce}&timestamp={timestamp}
        let timestamp = Date.now().toString();
        let appKey = Storage.get('upload_app_key');
        let appSecret = Storage.get('upload_app_secret');
        let api = Storage.get('upload_api');
        let body = {
            wechatNo: wechat,
            trendsContent: title,
            trendsImage: imagesUrl.length > 0 ? imagesUrl.join(',') : '',
            videoUrl: videoUrl,
            publishTime: publishTime,
        }

        let nonce = Math.floor(Math.random() * 1000000000) + '';
        let bodyHash = Encrypt.sha256(JSON.stringify(body));
        let stringToSign = `appKey=${appKey}&bodyHash=${bodyHash}&nonce=${nonce}&timestamp=${timestamp}`;
        let sign = Encrypt.hmac_sha256(appSecret, stringToSign);
        Common.log('stringToSign:' + stringToSign);
        Common.log('请求参数：', api, body, { 'X-App-Key': appKey, 'X-Timestamp': timestamp, 'X-Nonce': nonce, 'X-Sign': sign });
        let res = Http.post(api, body, {
            'X-App-Key': appKey,
            'X-Timestamp': timestamp,
            'X-Nonce': nonce,
            'X-Sign': sign,
            'Content-Type': 'application/json'
        });
        Common.log('请求返回结果：', res);
        if (!res) {
            FloatDialogs.toastLong('数据上报异常');
            return false;
        }

        let result = JSON.parse(res);
        if (result.code != 0) {
            FloatDialogs.toastLong('数据上报异常：' + result.msg);
            return false;
        }

        FloatDialogs.toastLong('数据上报异常：' + result.msg);
        return true;
    },

    /**
     * 
     * @param {String} imageFile 
     * @returns {string}
     */
    uploadCos(imageFile) {
        Cos.setConfig(Storage.get('cos_secret_id'), Storage.get('cos_secret_key'), Storage.get('cos_region'), Storage.get('cos_bucket'));
        let ext = imageFile.substring(imageFile.lastIndexOf('.') + 1);
        let res = Cos.upload(imageFile, "wechat-images/" + Date.now() + '.' + ext);
        Log.log(res);

        if (res[0]) {
            return res[0];
        }

        FloatDialogs.show("提示", '文件上传出错：' + res[1]);
        System.exit();
        System.sleep(5000);
        return '';//防止代码报错
    },

    scroll() {
        let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        let res = scrollTag.scrollForward();
        Common.log('下一页', res);
        Common.sleep(2000 + 1000 * Math.random());
        return res;
    },


    /**
     * 
     * @param {Array<string>} arr 
     * @param {string} keyword 
     * @returns 
     */
    contains(arr, keyword) {
        for (let i in arr) {
            if (arr[i].indexOf(keyword) != -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * 
     * @param {Array<UiObject>} imagesTag 
     * @returns 
     */
    getImage(imagesTag) {
        let tags = [];
        let rects = [];
        for (let i in imagesTag) {
            if (rects.indexOf(imagesTag[i].bounds().toString()) != -1) {
                continue;
            }

            rects.push(imagesTag[i].bounds().toString());
            tags.push(imagesTag[i]);
        }
        return tags;
    },

    backTop() {
        let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        while (scrollTag.scrollBackward()) {
            Common.sleep(1000);
            Common.log('滑动到上方');

            let captureTag = Common.id('fq').isVisibleToUser(true).findOne();
            if (!captureTag) {
                throw new Error('滑动出问题了，未找到图片区域');
            }
        }
        Common.log('到顶了');
        Common.sleep(2000);
        return true;
    },

    startWechat() {
        App.openAppSetting('com.tencent.mm');
        Common.sleep(2000);

        let i = 2;
        while (i-- > 0) {
            let tag = UiSelector().descContains('强').isVisibleToUser(true).filter(v => {
                return v.desc() && v.desc().length <= 4;
            }).findOne() || UiSelector().textContains('强').filter(v => {
                return v.text() && v.text().length <= 4;
            }).isVisibleToUser(true).findOne() || UiSelector().descContains('停').filter(v => {
                return v.desc() && v.desc().length <= 4;
            }).isVisibleToUser(true).findOne() || UiSelector().textContains('停').filter(v => {
                return v.text() && v.text().length <= 4;
            }).isVisibleToUser(true).findOne();
            console.log(tag);
            if (!tag) {
                tag = UiSelector().descContains('结').filter(v => {
                    return v.desc() && v.desc().length <= 4;
                }).isVisibleToUser(true).findOne() || UiSelector().textContains('结').filter(v => {
                    return v.text() && v.text().length <= 4;
                }).isVisibleToUser(true).findOne();
            }

            if (!tag) {
                Common.log('没有强行停止');
                continue;
            }

            Common.click(tag, 0.2);
            Common.log('强行停止');
            Common.sleep(2000);
        }

        let submitTag = UiSelector().isVisibleToUser(true).desc('确定').findOne() || UiSelector().isVisibleToUser(true).textContains('确定').findOne();
        if (submitTag) {
            Common.click(submitTag, 0.2);
        } else {
            Common.log('没有确认按钮');
        }
    },

    run() {
        this.startWechat();
        Common.sleep(3000);
        Common.openApp();
        Common.backHome();
        Common.log('进入了主页');

        //先进入“我”页面拿到微信号和昵称
        Index.intoMy();
        let nicknameTag = Common.id('kbb').isVisibleToUser(true).findOne();
        if (!nicknameTag) {
            throw new Error('未找到昵称');
        }
        this.nickname = nicknameTag.text();
        Common.log('昵称：' + this.nickname);
        if (!this.nickname) {
            throw new Error('未获取到昵称');
        }

        let wechatNoTag = Common.id('ouv').isVisibleToUser(true).findOne();
        if (!wechatNoTag) {
            throw new Error('未找到微信号');
        }
        this.wechatNo = wechatNoTag.text();//微信号：deeke2025
        if (!this.wechatNo) {
            throw new Error('未获取到微信号');
        }
        this.wechatNo = this.wechatNo.replace('微信号：', '');
        Common.log('微信号：' + this.wechatNo);

        Index.intoFund();
        Common.log('进入了发现页面');
        Index.intoFriendArea();
        Common.log('进入了朋友圈');

        this.backTop();
        this.getData();
        //this.backTop();
        Common.log('一轮完成');
    },

    /**
     * 
     * @param {UiObject[]} fileTags 
     * @returns {Array<string>}
     */
    saveFile(fileTags) {
        if (fileTags.length == 0) {
            return [];
        }

        for (let i in fileTags) {
            Common.log('点击文件', fileTags[i]);
            fileTags[i].click();
            Common.sleep(2000 + 1000 * Math.random());
            Common.log('查看图片或者视频');

            let x = Device.width() * (0.35 + 0.3 * Math.random());
            let y = Device.height() * (0.45 + 0.3 * Math.random());
            Gesture.press(x, y, 1000 + 100 * Math.random());

            Common.sleep(1300 + 300 * Math.random());
            Common.log('长按文件，准备保存');

            let saveTag = UiSelector().text('保存视频').isVisibleToUser(true).findOne() || UiSelector().text('保存图片').isVisibleToUser(true).findOne();
            Common.click(saveTag, 0.15);
            Common.sleep(2000 + 1000 * Math.random());
            if (saveTag.text() == '保存视频') {
                FloatDialogs.toast('保存视频，等待10秒');
                Common.sleep(10000);
            }

            Common.back();
            Common.sleep(1500 + 500 * Math.random());
        }

        let res = [];
        let files = Files.listFiles('/storage/emulated/0/Pictures/WeiXin');
        files.sort((a, b) => {
            return Files.lastModified(b) - Files.lastModified(a);
        });

        for (let i = 0; i < fileTags.length; i++) {
            Common.log('准备上传文件', files[i]);
            res.push(this.uploadCos(files[i]));
        }

        Common.log('文件总数：' + res.length);
        for (let i in files) {
            // if (parseInt(i) >= fileTags.length) {
            //     Common.log('删除文件完成');
            //     break;
            // }

            Files.delete(files[i]);
            Common.log('删除文件：' + files[i]);
        }

        res.reverse();//最新保存的图片，实际上是最后一张图
        return res;
    },

    /**
     * 
     * @param {UiObject} tag 
     * @returns 
     */
    zan(tag) {
        tag.click();
        Common.sleep(1500 + 1000 * Math.random());
        let zanTag = UiSelector(false).id('com.tencent.mm:id/qd').isVisibleToUser(true).findOne();
        Common.click(zanTag, 0.15);
        Common.sleep(2000 + 1000 * Math.random());
        Common.log('点赞完成');
        return true;
    },

    getData() {
        do {
            //查看当前内容是否点赞，如果点赞则不操作（已经操作过了）
            let tags = Common.id('n95').className('android.widget.LinearLayout').isVisibleToUser(true).find();
            Common.log('当前内容数量：' + tags.length);
            let _continue = false;
            for (let i in tags) {
                let nicknameTag = tags[i].children().findOne(Common.id('kbq').className('android.widget.TextView'));
                let titleTag = tags[i].children().findOne(Common.id('cut').className('android.widget.TextView'));
                let publishTimeParentTag = tags[i].children().findOne(Common.id('n93').className('android.widget.RelativeLayout'));
                let publishTimeTag = publishTimeParentTag.children().findOne(UiSelector().className('android.widget.TextView'));
                let nickname = nicknameTag.text();
                let title = titleTag ? titleTag.text() : '';
                Common.log('发布时间：' + publishTimeTag.text())
                let publishTime = Common.getTime(publishTimeTag.text());

                Common.log('昵称：' + nickname, '标题：' + title, '时间：' + publishTime);
                //如果时间超过24小时，则跳过// 转 Date（注意兼容性：把 "-" 换成 "/" 更稳）
                let publishTimestamp = new Date(publishTime.replace(/-/g, '/')).getTime();
                let now = Date.now();
                Common.log('发布时间戳：' + publishTimestamp, '当前时间戳：' + now);
                if (now - publishTimestamp > this.hour * 60 * 60 * 1000) {
                    Common.log('超过24小时，朋友圈已采集完成');
                    return true;
                }

                let zanTag = tags[i].children().findOne(Common.id('r33'));
                //看看点赞是不是出现了，没有出现，则滑动  注意，这里可能没有点赞区域（没有任何点赞）
                if (zanTag) {
                    if (zanTag.bounds().top > Device.height()) {
                        Common.log('点赞超出范围');
                        Common.log('即将滑动界面，重新获取界面数据');
                        break;
                    }

                    let arr = Images.findTextInRegion(Images.capture(), zanTag.bounds().left, zanTag.bounds().top, zanTag.bounds().width(), zanTag.bounds().height());
                    if (this.contains(arr, this.nickname)) {
                        Common.log('已点赞');
                        continue;
                    }
                }

                //获取微信号
                let headTag = tags[i].children().findOne(Common.id('od'));
                headTag.click();
                Common.sleep(1500 + 1000 * Math.random());
                let wechatTag = Common.id('cff').className('android.widget.TextView').isVisibleToUser(true).findOne();
                if (!wechatTag) {
                    throw new Error('未找到微信号');
                }
                let wechat = wechatTag.text();
                Common.log('微信号', wechat);
                if (!wechat) {
                    throw new Error('未找到微信号');
                }

                wechat = wechat.replace('微信号: ', '');
                console.log(wechatTag.text());
                Common.back();
                Common.sleep(1000 + 1000 * Math.random());
                //检查微信是否符合
                if (!this.checkWechat(wechat)) {
                    Common.log('不是会员，跳过');
                    FloatDialogs.toast('不是会员，跳过');
                    continue;
                }

                let zTag = tags[i].children().findOne(Common.id('r2'));
                if (zTag.isVisibleToUser() == false) {
                    Gesture.swipe(500, 500, 550, 250, 200);
                    _continue = true;
                    break;
                }

                //朋友圈类型

                let videoUrl = '';
                /**
                 * @type {string[]}
                 */
                let imagesUrl = [];
                let videoTag = tags[i].children().findOne(Common.id('hc0'));
                if (videoTag) {
                    Common.log('视频', videoTag.desc());
                    let files = this.saveFile([videoTag]);
                    videoUrl = files[0];
                } else {
                    //视频也有图片，因此非视频才查看图片
                    let imagesTag = tags[i].children().find(Common.id('jc5'));
                    if (imagesTag) {
                        imagesTag = this.getImage(imagesTag);
                        Common.log("图片", imagesTag.length);
                        imagesUrl = this.saveFile(imagesTag);
                    }
                }

                Common.log(['朋友圈信息', wechat, nickname, title, imagesUrl, videoUrl]);
                this.uploadData(wechat, title, imagesUrl, videoUrl, Common.getTime(publishTime));
                Common.sleep(1000 + 500 * Math.random());
                this.zan(zTag);
                Common.log('点赞完成，结束本次循环');
                tags = Common.id('n95').className('android.widget.LinearLayout').isVisibleToUser(true).find();
                continue;//这里不执行break，否则会遗漏
            }
            if (_continue) {
                continue;
            }
        } while (this.scroll());
    },
}

function getDate() {
    let d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

let errorCount = 0;
let date = getDate();
let times = Storage.getInteger('toker_times');

//判断是否有文件读写权限
if (!Access.hasStoragePermission()) {
    console.log('没有权限');
    FloatDialogs.show('提示', '请开启图片和视频权限');
    Common.sleep(1000);
    if (Access.isStoragePermissionPermanentlyDenied()) {
        console.log('禁止了权限');
        Access.openPermissionSettings();//永久禁止，需要用户进入当前设置页手动打开
    } else {
        Access.requestStoragePermission();//请求权限
        console.log('请求权限');
    }
    System.exit();
    Common.sleep(1000);
} else {
    console.log('有权限');
}

while (true) {
    try {
        if (getDate() != date) {
            date = getDate();
            times = Storage.getInteger('toker_times');
        }

        if (times <= 0) {
            Common.log('今日任务完成');
            Common.sleep(60);
            continue;
        }

        task.log();
        Common.log('任务配置', Storage.get('toker_times'), Storage.getInteger('toker_munite'), times);
        task.cosCheck();
        task.apiCheck();
        task.run();
        errorCount = 0;
        Common.log('任务完成');
        Common.back(2);
        Common.sleep(2000);
        Common.backApp();
        times--;
        Common.sleep(Storage.getInteger('toker_munite') * 60 * 1000);
    } catch (e) {
        // @ts-ignore
        Common.log('任务出错，原因：' + e, e.message, e.stack);
        if (errorCount++ > 3) {
            FloatDialogs.show("提示", '任务出错，原因：' + e);
            System.exit();
            System.sleep(5000);
        }
    }
}
