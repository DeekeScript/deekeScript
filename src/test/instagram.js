

// let tags = UiSelector().scrollable(true).isVisibleToUser(true).find();
// console.log(tags);
// tags[0].scrollForward();

// UiSelector().id('com.instagram.android:id/clips_viewer_view_pager').isVisibleToUser(true).scrollable(true).findOne().scrollForward();

// console.log(UiSelector().id('com.instagram.android:id/clips_viewer_view_pager').isVisibleToUser(true).scrollable(true).findOne());


// let tag = UiSelector().id('com.instagram.android:id/clips_caption_component').isVisibleToUser(true).findOne();
// console.log(tag.children().findOne(UiSelector().descMatches('.+')));


let tag = UiSelector().id('com.instagram.android:id/sticky_header_list').isVisibleToUser(true).scrollable(true).findOne();
tag.scrollForward();
