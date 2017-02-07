var auth, database, userInfo, selectedKey;

var config = {
    apiKey: "AIzaSyBI8zqLEQsKI4be9Zm4xmrPRNhCNUV_IhU",
    authDomain: "memoapp-dd157.firebaseapp.com",
    databaseURL: "https://memoapp-dd157.firebaseio.com",
    storageBucket: "memoapp-dd157.appspot.com",
    messagingSenderId: "67758349179"
};

firebase.initializeApp(config);
auth = firebase.auth();
database = firebase.database();

var authProvider = new firebase.auth.GoogleAuthProvider();
auth.onAuthStateChanged(function(user) {
    if (user) {
    //signed
    userInfo = user;
    console.log('success', user);
    getMemoList();
    } else {
    // denied
    auth.signInWithPopup(authProvider);
    }
});

function getMemoList() {
    var memoRef = database.ref('memos/' + userInfo.uid);
    memoRef.on('child_added', onChildAdded);
    memoRef.on('child_changed', onChildChanged);
}

function onChildChanged(data) {
    $('#'+data.key).replaceWith(getHtml(data));
}

function onChildAdded(data) {
        $('.collection').append(getHtml(data));
}

function getHtml(data) {
    var key = data.key;
    var memo = data.val();
    console.log('childData', key);
    console.log('childData', memo);
    var txt = memo.txt;
    var title = txt.substr(0, 3);
    var firstTxt = txt.substr(0,1);
    return "<li id='"+key+"' class=\"collection-item avatar\" onclick=\"getMemo(this.id);\" >" +
        "<i class=\"material-icons circle red\">" +firstTxt + "</i>" +
        "<span class=\"title\">" + title + "</span>" +
        "<p class='txt'>" + txt + "<br>" +
        "</p>" +
        "<a href=\"#\" onclick=\"deleteMemo('"+ key +"')\">삭제</a>" +
        "</li>";

}

function getMemo(key) {
    selectedKey = key;
    var memoRef = database.ref('memos/' + userInfo.uid + '/' + key)
    .once('value')
    .then(function(snapshot) {
        $('.textarea').val(snapshot.val().txt);
    });
}

function saveMemo() {
    var memoRef = database.ref('memos/' + userInfo.uid);
    var txt = $('.textarea').val();
    if (!txt) {
    return;
    }

    if(selectedKey) {
    var memoRef2 = database.ref('memos/' + userInfo.uid + '/' + selectedKey);
    memoRef2.update({
        txt: txt,
        updateDate: new Date().getTime()
    })
    } else {
    memoRef.push({
        txt: txt,
        createDate: new Date().getTime()
    })
    }
}

function initMemo() {
    $('.textarea').val('');
    selectedKey = undefined;
}

function deleteMemo(key) {
    if (!confirm('삭제하시겠습니까?')) {
    return;
    } else {
    var memoRef = database.ref('memos/' + userInfo.uid + '/' + key);
    memoRef.remove();
    $('#'+key).remove();
    }
}

$(function() {
    $('.textarea').blur(function() {
    saveMemo();
    });
});
/*
    {
        memos :{
        uid : { text : '텍스트', 작성일:  '작성일', 제목 : '제목'},
        uid : { text : '텍스트', 작성일:  '작성일', 제목 : '제목'},
        uid : { text : '텍스트', 작성일:  '작성일', 제목 : '제목'},
        }
    }
*/