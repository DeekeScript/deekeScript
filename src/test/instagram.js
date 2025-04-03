

// let tags = UiSelector().scrollable(true).isVisibleToUser(true).find();
// console.log(tags);
// tags[0].scrollForward();

// UiSelector().id('com.instagram.android:id/clips_viewer_view_pager').isVisibleToUser(true).scrollable(true).findOne().scrollForward();

// console.log(UiSelector().id('com.instagram.android:id/clips_viewer_view_pager').isVisibleToUser(true).scrollable(true).findOne());


// let tag = UiSelector().id('com.instagram.android:id/clips_caption_component').isVisibleToUser(true).findOne();
// console.log(tag.children().findOne(UiSelector().descMatches('.+')));


// let tag = UiSelector().id('com.instagram.android:id/sticky_header_list').isVisibleToUser(true).scrollable(true).findOne();
// tag.scrollForward();
// let a = 23;
// console.log(UiSelector().id('com.instagram.android:id/action_bar_button_back').filter(v => {
//     console.log(a);
//     return true;
// }).findOne());

// let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
//     return v && v.id() === 'activity_feed_list';
// }).findOne();
// console.log(tag);
// console.log(tag.scrollForward());

let latestPrivateMsgTag = UiSelector().id('com.instagram.android:id/direct_text_message_text_view').isVisibleToUser(true).filter(v => {
    //必须是右边距大于左边距
    return v && v.bounds() && v.bounds().left < Device.width() - (v.bounds().left + v.bounds().width());
}).findOne();
console.log(latestPrivateMsgTag);
