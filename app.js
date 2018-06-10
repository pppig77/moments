// TODO: 用户名称需修改为自己的名称
var userName = 'PPPIG';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和', 
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: true,
    likes: ['PPPIG','Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];
// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
var $body = $(document.body);
var $window = $(window);
var $button = $('.coment-int button');
var $userName1 = $('.user-name');
var $show = $('.show');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
// 分享消息模板
function multipleshare(share){
  var htmlText = [];
  htmlText.push('<div class="item-share">');
  htmlText.push('<img class="share-img" src="' + share.pic + '">');
  htmlText.push('<span class="share-tt">' + share.text + '</span>');
  htmlText.push('</div>');
  return htmlText.join('');
}
// 单图模板
function multiplePic(pics){
  var htmlText = [];
  htmlText.push('<img class="item-only-img" src="' + pics[0] + '">')
  return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */ 
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="0">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = multipleshare(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = multiplePic(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  // htmlText.push('<div class="autocomplete"></div>');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="autocomplete">');
  htmlText.push(reply(messageData));
  htmlText.push('</div>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}
//显示点赞评论
function reply(rex){
  var htmlText = [];
  htmlText.push('<div class="like">');
  if(rex.reply.hasLiked){
    htmlText.push('<span class="like">取消</span>');
  }else{
    htmlText.push('<span class="like">点赞</span>');
  }
  htmlText.push('</div>');
  htmlText.push('<div class="comment">');
  htmlText.push('<span class="comment">评论</span>');
  htmlText.push('</div>');
  return htmlText.join('');
}
//评论事件
function autoComplete(intvalue) {
  if(intvalue){
    $button.removeAttr('disabled');
    $button.removeClass('stop');
    $button.addClass('admit')
  }else {
    $button.attr('disabled','disabled');
    $button.removeClass('admit');
    $button.addClass('stop')
  }
}
/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
 
    var messageHtml=[];
    for(let i=0;i<data.length;i++){
      messageHtml.push(messageTpl(data[i]));
    }
  $momentsList.html(messageHtml.join(''));
  $userName1.html(userName);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  var ind,
      $autocomplete = $('.autocomplete'),
      $reply = $('.item-reply'),
      $comment = $('.coment-int'),
      $input =$('.coment-int input');
//展示点赞评论面板
  $body.on('click','.item-reply', function(){
    ind = $(this).parents('.moments-item').index()
  });
//隐藏点赞评论面板
  $body.on('click', function(event) {
    var target = event.target,
        $target = $(target);
    if ($target.hasClass('item-reply')) {
      for(let i=0;i<data.length;i++){
        $autocomplete[i].style.width = '0px';
      }
      $autocomplete[ind].style.width = '148px';
    }else
        for(let i=0;i<data.length;i++){
          $autocomplete[i].style.width = '0px';
        }
    if ($target.hasClass('comment')) {
      $comment.show();
    }else
      $comment.fadeOut();
  });  
//点赞事件
  $body.on('click','div.like',function(){
  if(data[ind].reply.hasLiked){
    var dex = data[ind].reply.likes.indexOf(userName);
    data[ind].reply.likes.splice(dex,1);
    data[ind].reply.hasLiked = false;
  }else{
    data[ind].reply.likes.push(userName);
    data[ind].reply.hasLiked = true;
  }
  $autocomplete.eq(ind).html(reply(data[ind])); 
  $('.reply-zone').eq(ind).html(likesHtmlTpl(data[ind].reply.likes)+commentsHtmlTpl(data[ind].reply.comments)); 
  });
//评论事件
  $body.on('click','div.comment',function(){
    $comment.show();
  });
  $button.click(function(){
    value = $input.val();
    data[ind].reply.comments.push({
      author: userName,
      text: value
    });
    $comment.hide();
    $('.reply-zone').eq(ind).html(likesHtmlTpl(data[ind].reply.likes)+commentsHtmlTpl(data[ind].reply.comments));
    $input.val('');
    autoComplete();
  });

//捕获评论输入
  $body.on('keyup', 'input', function() {
  var value = $(this).val();
  autoComplete(value);
  });
//放大图片
  $body.on('click','img',function(){
    console.log($(this).attr("src"))
    $show.html('<img src="'+$(this).attr("src")+'">');
    $show.show();
  });
  $show.click(function(){
    $show.hide();
  });  
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();