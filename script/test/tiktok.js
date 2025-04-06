


// let _tags = UiSelector().scrollable(true).id('com.zhiliaoapp.musically:id/u_q').className('androidx.viewpager.widget.ViewPager').find();
// console.log(_tags, _tags[0].scrollForward());


// App.backApp();

// console.log(UiSelector().id('android:id/text1').text('For You').isVisibleToUser(true).findOne());

// let tag = UiSelector().id('com.zhiliaoapp.musically:id/nl9').isVisibleToUser(true).scrollable(true).filter(v => {
//     return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
// }).findOne();

// tag.scrollForward();
// console.log(tag);

// if (UiSelector().text('LIVE').isVisibleToUser(true).filter(v => {
//     return v && v.bounds() && v.bounds().left > Device.width() * 0.75 && v.bounds().top > Device.height() * 0.3 && v.bounds().top < Device.height() * 0.7;
// }).exists()) {
//     console.log('直播中，下一个');
// }


// let tags = UiSelector().id('com.zhiliaoapp.musically:id/hf6').isVisibleToUser(true).scrollable(true).findOne();
// console.log(tags);
// tags.scrollForward();

let tags = UiSelector().id('com.zhiliaoapp.musically:id/l46').isVisibleToUser(true).scrollable(true).findOne();
console.log(tags);
tags.scrollForward();

