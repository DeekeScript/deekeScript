
let Common = {
    id(name) {
        return UiSelector().id('com.smile.gifmaker:id/' + name);
    },

    click(tag, rate = 0.1) {
        if (!rate) {
            rate = 0.1;
        }
        let x = tag.bounds().left + tag.bounds().width() * (rate + Math.random() * (1 - rate));
        let y = tag.bounds().top + tag.bounds().height() * (rate + Math.random() * (1 - rate));
        return Gesture.click(x, y);
    },

    log(...args) {
        console.log(args);
        Log.log(args);
    },

    contains(title, keywords) {
        for (let k in keywords) {
            if (title.indexOf(keywords[k]) !== -1) {
                return true;
            }
        }
        return false;
    },

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        Common.log('数字：', text[0]);
        return text[0] * 1;//可能存在多个逗号
    },

    selectPhoto(file, isPrivate) {
        let file2 = MediaStore.saveContentImageToGallery(file);//文件移动到相册
        try {
            if (!isPrivate) {
                let tag = UiSelector().desc('插入图片').isVisibleToUser(true).findOne();
                // Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
                tag.click();
                System.sleep(2000 + 1000 * Math.random());
            } else {
                let tag = UiSelector().desc('更多面板').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
                System.sleep(3000);

                tag = UiSelector().text('相册').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
                System.sleep(3000);
            }

            let imageTag = UiSelector().className('android.widget.ImageView').isVisibleToUser(true).filter(v => {
                return v.parent().className() == 'android.widget.FrameLayout' && v.parent().bounds().width() == v.parent().bounds().height();
            }).findOne();

            Gesture.click(imageTag.bounds().centerX(), imageTag.bounds().centerY());
            System.sleep(500);
        } catch (e) {
            Common.log("图片处理异常：", e);
        }

        System.sleep(1000);
        return function () {
            let success = MediaStore.deleteImage(file2);
            if (success) {
                Log.log('删除成功');
            } else {
                Log.log('删除失败');
            }
        }
    },

    swipeSearchUserOp(filterRootLayout) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            if (filterRootLayout) {
                return v.children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/root_layout').isVisibleToUser(true));
            }
            return true;
        }).isVisibleToUser(true).findOne();
        if (!tag) {
            Common.log('滑动失败');
            return 0;
        }

        if (tag.scrollForward()) {
            Common.log('滑动成功');
            return true;
        }
        Common.log('滑动到底了');
        return false;
    },

    swipeCommentListOp() {
        return this.swipeSearchUserOp();
    },

    sleep(time) {
        System.sleep(time);
    },

    back(times) {
        if (!times) {
            times = 1;
        }
        for (let i = 0; i < times; i++) {
            if (Common.id('title').textContains('@').isVisibleToUser(true).findOne()) {
                Common.log('-在视频页面，不能返回');
                return true;
            }

            Gesture.back();
            Common.log('返回一次');
            //判断是不是在视频页面，是的话，则不能返回

            Common.sleep(500);
        }
    },

    city: null,
    //判断在哪个页面
    inXPage() {
        if (!Common.id('user_avatar').findOne()) {
            Common.log('不在指定页面');
            return null;
        }

        if (this.city) {
            if (UiSelector().descContains(this.city).findOne()) {
                return 'tongcheng';
            }
            Common.log('不在同城页面');
            FloatDialogs.show('不在同城页面，请重新启动');
            System.exit();
            System.sleep(3000);
            return null;
        }

        if (UiSelector().className('android.widget.TextView').text('搜索').findOne()) {
            Common.log('在搜索页面');
            return 'search';
        }

        if (UiSelector().descContains('推荐').descContains('已选中').findOne()) {
            Common.log('在推荐页面');
            return 'tuijian';
        }

        let tag = UiSelector().descContains('已选中').findOne();
        if (tag) {
            Common.log('在同城页面');
            Common.city = tag.desc();
            return 'tongcheng';
        }
    }
}

module.exports = Common;