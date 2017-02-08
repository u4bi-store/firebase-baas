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
            
            authInfo(user); /* 인증 유저의 제공 사이트 정보조회*/
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

    // console.log('유저의 키코드 : '+key);
    // console.log('내용 : '+txt);
    // console.log('기록시간 : '+date);
    // console.log('----------------------');

}

/* 인증 유저의 제공 사이트 프로필 정보조회*/
function authInfo(user){
    user.providerData.forEach(function (profile) {
        console.log("제공 사이트: "+profile.providerId);
        console.log("유저 고유번호 : "+profile.uid);
        console.log("유저 이름 : "+profile.displayName);
        console.log("유저 이메일 : "+profile.email);
        console.log("유저 사진 : "+profile.photoURL);
    });
    console.log('-----------------------------------');
    
    profileInfo(user); /* 변경전 인증 유저의 사용자 프로필 조회 */
    authProfileUpdate(user);/* 인증 유저의 사용자 프로필 업데이트 */
}

/* 인증 유저 프로필 업데이트*/
function authProfileUpdate(user){
    user.updateProfile({
        displayName: "닉네임 변경함",
        photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
        console.log('인증 유저 프로필 업데이트 성공');
        profileInfo(user); /* 변경후 인증 유저의 사용자 프로필 조회 */
    }, function(error) {
        console.log(error); /* 에러 송신부 */
    });
    console.log('-----------------------------------');
}

function profileInfo(user){

    var uid = user.uid;
    var name = user.displayName;
    var email = user.email;
    var photo = user.photoURL;

    console.log('유저 고유번호 : '+uid);
    console.log('유저이름 : '+name);
    console.log('유저 이메일 : '+email);
    console.log('유저 사진 : '+photo);
}