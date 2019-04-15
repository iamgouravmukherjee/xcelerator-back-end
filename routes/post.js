const router = require('express').Router();
const postModel = require('../model/post');


router.get('/', (req, res, next) => {
   postModel.find({})
      .then(response => {
         res.status(201).json({ message: 'documents found', data: response })
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to find documents', error });
      })
})

router.get('/:id', (req, res, next) => {
   postModel.find({ id: req.params.id })
      .then(response => {
         res.status(200).json({ message: 'document found', data: response })
      })
      .catch(error => {
         res.status(400).json({ message: 'unable to find document', error })
      })
})

router.post('', (req, res, next) => {

   const paths = {
      0: "https://images.unsplash.com/photo-1502772066658-3006ff41449b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1456&q=80",
      1: "https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=769&q=80",
      2: "https://images.unsplash.com/photo-1519127008657-d552258f18d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
      3: "https://images.unsplash.com/photo-1504465039710-0f49c0a47eb7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80",
      4: "https://images.unsplash.com/photo-1505262744895-ac5705911f6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=680&q=80"
   }

   let docs = req.body.data;
   docs = docs.map(doc => {
      doc['imageUrl'] = paths[Math.floor(Math.random() * 4)]
      return doc;
   })

   postModel.insertMany(docs)
      .then(response => {
         res.status(201).json({ message: 'documents inserted successfully', data: response })
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to insert documents', error });
      })
})

router.patch('/:id', (req, res, next) => {
   console.log(req.body.type);
   postModel.find({ id: req.params.id })
      .then(doc => {
         if (doc.length > 0) {
            console.log('doc', doc[0]);
            let fields;
            switch (req.body.type) {
               case "liked":
                  fields = { liked: !doc[0].liked, disliked: false }
                  break;
               case "disliked":
                  fields = { disliked: !doc[0].disliked, liked: false }
                  break;
               case "bookmarked":
                  fields = { bookmarked: !doc[0].bookmarked }
                  break;
               default:
                  res.status(400).json({ message: 'unable to update documents', error: "Invalid action type" });
                  next();
            }
            postModel.findOneAndUpdate({ id: req.params.id }, { $set: { ...fields } })
               .then(response => {
                  res.status('201').json({ message: 'updated successfully', data: response })
               })
               .catch(error => {
                  console.log('error', error);
                  res.status(400).json({ message: 'unable to update documents', error });
               })
         } else {
            res.status(400).json({ message: 'unable to update documents', error: "Could not find a post with that id" });
         }
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to update documents', error });
      })
})

module.exports = router;