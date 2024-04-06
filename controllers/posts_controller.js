const {models} = require("../models");
const createError = require('http-errors');
const { Sequelize } = require('sequelize');

exports.index = async (req, res, next) => { 
    try {
        const findOptions = { 
            include: [
                {model: models.Attachments, as: 'attachment'}
            ]
        };
        const posts = await models.Posts.findAll(findOptions);
        res.render('posts/index.ejs', {posts});  
    } catch (error) {
        next(error);
    }
  };

exports.load =  async (req, res, next, postId) => {
  try {
    const post = await models.Posts.findByPk(postId, {
      include: [
        {model: models.Attachments, as: 'attachment'} 
      ]
    });

    if (post) {
      req.load = {...req.load, post};
      next();
    } else {
      throw createError(404, 'No hay ningún Post con id ='+ postId)}
  } catch (error) {
    next(error);
  }
};

exports.attachment =  async (req, res, next) => {
  const {post} = req.load;
  const {attachment} = post;

  if (!attachment) {
      res.redirect("/images/none.png");
  } else if (attachment.image) {
      res.type(attachment.mime);
      res.send(attachment.image);
  } else if (attachment.url) {
      res.redirect(attachment.url);
  } else {
      res.redirect("/images/none.png");
  }
}

exports.show = async (req, res, next) => {
  const {post} = req.load;
  res.render('posts/show', {post});
}

exports.new = (req, res, next) => {
  const post = {title:"",body:""};
  res.render('posts/new', {post});
};

exports.create = async (req, res, next) => {
  const {title, body} = req.body;
  let post;

  try {
    post = models.Posts.build({
      title,
      body
    });
    post = await post.save({fields: ["title", "body"]});

    try {
      if (!req.file) {
        console.log('Info: publicación sin archivo adjunto.');
          return;
      }
      const attachment = await models.Attachments.create({
        mime: req.file.mimetype,
        image: req.file.buffer,
        url: null
      });
      await post.setAttachment(attachment);
      console.log('El archivo adjunto se ha guardado correctamente');
    } catch (error) {
      console.log('Error' + error.message);
    } finally {
      res.redirect('/posts/' + post.id);
    }
  } catch (error) {
    if (error instanceof (Sequelize.ValidationError)) {
      console.log('Hay errores en el formulario:');
      error.errors.forEach(({message}) => console.log(message));
      res.render('posts/new', {post});
    } else {
      next(error);}}};

exports.edit = (req, res, next) => {
  const {post} = req.load;
  res.render('posts/edit', {post});
};

exports.update = async (req, res, next) => {
  const {post} = req.load;
  post.title = req.body.title;
  post.body = req.body.body;

  try {
    await post.save({fields: ["title", "body"]});
    try {
      if (!req.file) {
        console.log('Info: el archivo adjunto de la publicación no ha cambiado.');
        return;
      }
      await post.attachment?.destroy();
      const attachment = await models.Attachments.create({
        mime: req.file.mimetype,
        image: req.file.buffer,
        url: null
      });
      await post.setAttachment(attachment);
      console.log('El archivo adjunto se ha guardado correctamente');
    } catch (error) {
      console.log('Error:' + error.message);
    } finally {
      res.redirect('/posts/' + post.id);
    }
  } catch (error) {
    if (error instanceof (Sequelize.ValidationError)) {
      console.log('Hay errores en el formulario:');
      error.errors.forEach(({message}) => console.log(message));
      res.render('posts/edit', {post});
    } else {
      next(error);
    }
  }
};

exports.destroy = async(req,res,next)=>{
const {post} = req.load;

  try{
    await post.destroy();
    
    if (post.attachmentId) {
      await post.attachment?.destroy();
    }
    res.redirect('/posts');
  } catch (error) {
    next(error);
  }
};
