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
            console.log('인증완료 : ', user);
            
            authInfo(user); /* 인증 유저 정보조회*/
            selects(); /* 모든 유저를 조회함 */
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
    console.log(' 삭제 -------------------------');
    memoRef.remove();
}


function onChildChanged(data) {
    console.log(data);
    console.log(' changed -------------------------');
}

function onChildAdded(data) {
    var key = data.key;
    var json = data.val();

    var txt = json.txt;
    var date = json.createDate;

    console.log('유저의 키코드 : '+key);
    console.log('내용 : '+txt);
    console.log('기록시간 : '+date);
    console.log('----------------------');

}

function authInfo(user){
    user.providerData.forEach(function (profile) {
        console.log("제공 사이트: "+profile.providerId);
        console.log("유저 고유번호 : "+profile.uid);
        console.log("유저 이름 : "+profile.displayName);
        console.log("유저 이메일 : "+profile.email);
        console.log("유저 사진 : "+profile.photoURL);
    });
    console.log('-----------------------------------');

}