Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {
    path: '/'
  });
});

//Router.route('/', function () {
//  this.render('Home');
//});