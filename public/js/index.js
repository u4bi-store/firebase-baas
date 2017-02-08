var auth, database, userInfo, selectedKey;

var config = {
    apiKey: "AIzaSyBI8zqLEQsKI4be9Zm4xmrPRNhCNUV_IhU",
    authDomain: "memoapp-dd157.firebaseapp.com",
    databaseURL: "https://memoapp-dd157.firebaseio.com",
    storageBucket: "memoapp-dd157.appspot.com",
    messagingSenderId: "67758349179"
};

init();

function init(){
    firebase.initializeApp(config);
    auth = firebase.auth();
    database = firebase.database();

    var authProvider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged(function(user) {
        if (user) {
            // 회원가입
            userInfo = user;
            console.log(' success', user);
            selects();
        } else {
            // 재로그인
            auth.signInWithPopup(authProvider);
        }
    });
}

// selects
// select
// save
// remove

function selects(){
    var memoRef = database.ref('memos/' + userInfo.uid);
    memoRef.on('child_added', onChildAdded);
    memoRef.on('child_changed', onChildChanged);
}
function select(key) {
    selectedKey = key;
    var memoRef = database.ref('memos/' + userInfo.uid + '/' + key)
    .once('value')
    .then(function(data) {
        console.log(data);
        console.log(' select -------------------------');
    });
}
function save() {
    var memoRef = database.ref('memos/' + userInfo.uid);
    var txt = 'tset123';

    if(selectedKey) {
        var memoRef2 = database.ref('memos/' + userInfo.uid + '/' + selectedKey);
        memoRef2.update({
            txt: txt,
            updateDate: new Date().getTime()
        });
    } else {
        memoRef.push({
            txt: txt,
            createDate: new Date().getTime()
        });
    }
}

function remove(key) {
    var memoRef = database.ref('memos/' + userInfo.uid + '/' + key);        
    console.log(memoRef);
    console.log(' remove -------------------------');
    memoRef.remove();
}


function onChildChanged(data) {
    console.log(data);
    console.log(' changed -------------------------');
}

function onChildAdded(data) {
    console.log(data.val());
    console.log(' added -------------------------');
}