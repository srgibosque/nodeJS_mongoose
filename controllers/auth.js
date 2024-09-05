exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie'));
  const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  console.log(isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login'
  });
}

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
}