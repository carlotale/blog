exports.getAuthor = function(req, res, next) {
    res.render('author', { title: 'Author' });
};