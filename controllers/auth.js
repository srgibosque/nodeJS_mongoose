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
  req.session.isLoggedIn = true;
  res.redirect('/');
}