const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/add-product',
    isEditing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({ title: title, imageUrl: imageUrl, price: price, description: description });
  product
    // the save method is provide by mongoose
    .save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (product) {
        res.render('admin/edit-product', {
          pageTitle: 'Edit product',
          path: '/edit-product',
          isEditing: editMode,
          product: product
        });
      }
    })
    .catch(err => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      // If the product already exists save method works as an update and not a create operation. Thanks to mongoose
      return product.save()
    })
    .then(result => {
      console.log("Product successfully updated");
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
  // we shall retriev only the products for one user
  Product
    .find()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.error(err));
}