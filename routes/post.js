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
      0: "https://www.pexels.com/photo/man-reading-a-newspaper-902194/",
      1: "https://www.pexels.com/photo/man-sitting-on-red-wooden-chair-while-reading-newspaper-1323590/",
      2: "https://www.pexels.com/photo/app-business-communication-connection-242492/",
      3: "https://www.pexels.com/photo/administration-articles-bank-black-and-white-261949/",
      4: "https://www.pexels.com/photo/gray-laptop-computer-near-journals-177557/"
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