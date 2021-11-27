function duplicationCheck() {
  var users = ['peter', 'name2', 'name3'];
  var userId = document.getElementById('userId').value;
  for (var i = 0; i < users.length; i++) {
    if (userId == users[i]) {
      document.getElementById('userId').value = '';
      return alert(userId + '는 존재하는 아이디 입니다.');
    }
  }
  alert('사용 가능한 아이디입니다.');
}

function test() {
  const p1 = document.getElementById('password1').value;
  const p2 = document.getElementById('password2').value;
  const em = document.getElementById('error');
  if (p1.length < 6) {
    em.innerHTML = '입력한 글자가 6글자 이상이어야 합니다.'; //에러 메세지 출력
    return false;
  }

  if (p1 != p2) {
    em.innerHTML = '비밀번호가 일치 하지 않습니다';
    return false;
  } else {
    em.innerHTML = '비밀번호가 일치합니다';
    return true;
  }
}
